from .base import LLMProvider

AVAILABLE_MODELS: list[dict] = [
    {"id": "gpt-5.5", "name": "GPT-5.5", "provider": "openai"},
    {"id": "gpt-5.4", "name": "GPT-5.4", "provider": "openai"},
    {"id": "gpt-5.4-mini", "name": "GPT-5.4 Mini", "provider": "openai"},
    {"id": "claude-sonnet-5", "name": "Claude Sonnet 5", "provider": "anthropic"},
    {
        "id": "claude-haiku-4-5-20251001",
        "name": "Claude Haiku 4.5",
        "provider": "anthropic",
    },
]

_instances: dict[str, LLMProvider] = {}


def get_provider(model: str) -> LLMProvider:
    entry = next((m for m in AVAILABLE_MODELS if m["id"] == model), None)
    if entry is None:
        raise ValueError(f"Unknown model: {model}")
    vendor = entry["provider"]
    if vendor not in _instances:
        if vendor == "openai":
            from .openai_provider import OpenAIProvider

            _instances[vendor] = OpenAIProvider()
        elif vendor == "anthropic":
            from .anthropic_provider import AnthropicProvider

            _instances[vendor] = AnthropicProvider()
        else:
            raise ValueError(f"Unknown provider: {vendor}")
    return _instances[vendor]
