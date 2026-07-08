from abc import ABC, abstractmethod
from typing import AsyncGenerator, Optional


class LLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        messages: list[dict],
        model: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        top_p: Optional[float] = None,
    ) -> str: ...

    @abstractmethod
    def generate_stream(
        self,
        messages: list[dict],
        model: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        top_p: Optional[float] = None,
    ) -> AsyncGenerator[str, None]:
        """Yields text tokens as they arrive."""
        ...
