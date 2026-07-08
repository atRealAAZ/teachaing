from typing import AsyncGenerator, Optional

from anthropic import AsyncAnthropic

from .base import LLMProvider

DEFAULT_MAX_TOKENS = 4096


def _split_system(messages: list[dict]) -> tuple[Optional[str], list[dict]]:
    system = None
    rest = []
    for m in messages:
        if m.get("role") == "system" and system is None:
            system = m.get("content")
        else:
            rest.append(m)
    return system, rest


class AnthropicProvider(LLMProvider):
    def __init__(self) -> None:
        self._client = AsyncAnthropic()

    async def generate(
        self,
        messages: list[dict],
        model: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        top_p: Optional[float] = None,
    ) -> str:
        system, rest = _split_system(messages)
        kwargs: dict = {
            "model": model,
            "messages": rest,
            "max_tokens": max_tokens or DEFAULT_MAX_TOKENS,
        }
        if system:
            kwargs["system"] = system
        if temperature is not None:
            kwargs["temperature"] = temperature
        if top_p is not None:
            kwargs["top_p"] = top_p
        response = await self._client.messages.create(**kwargs)
        return "".join(
            block.text for block in response.content if block.type == "text"
        )

    async def generate_stream(
        self,
        messages: list[dict],
        model: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        top_p: Optional[float] = None,
    ) -> AsyncGenerator[str, None]:
        system, rest = _split_system(messages)
        kwargs: dict = {
            "model": model,
            "messages": rest,
            "max_tokens": max_tokens or DEFAULT_MAX_TOKENS,
        }
        if system:
            kwargs["system"] = system
        if temperature is not None:
            kwargs["temperature"] = temperature
        if top_p is not None:
            kwargs["top_p"] = top_p
        async with self._client.messages.stream(**kwargs) as stream:
            async for text in stream.text_stream:
                yield text
