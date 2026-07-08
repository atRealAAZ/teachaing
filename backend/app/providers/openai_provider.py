from typing import AsyncGenerator, Optional

from openai import AsyncOpenAI

from .base import LLMProvider


class OpenAIProvider(LLMProvider):
    def __init__(self) -> None:
        self._client = AsyncOpenAI()

    async def generate(
        self,
        messages: list[dict],
        model: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        top_p: Optional[float] = None,
    ) -> str:
        kwargs: dict = {"model": model, "messages": messages}
        if temperature is not None:
            kwargs["temperature"] = temperature
        if max_tokens is not None:
            kwargs["max_completion_tokens"] = max_tokens
        if top_p is not None:
            kwargs["top_p"] = top_p
        response = await self._client.chat.completions.create(**kwargs)
        return response.choices[0].message.content or ""

    async def generate_stream(
        self,
        messages: list[dict],
        model: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        top_p: Optional[float] = None,
    ) -> AsyncGenerator[str, None]:
        kwargs: dict = {"model": model, "messages": messages, "stream": True}
        if temperature is not None:
            kwargs["temperature"] = temperature
        if max_tokens is not None:
            kwargs["max_completion_tokens"] = max_tokens
        if top_p is not None:
            kwargs["top_p"] = top_p
        stream = await self._client.chat.completions.create(**kwargs)
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
