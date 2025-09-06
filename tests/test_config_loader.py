"""
Tests for configuration loading functionality.

Este módulo contém testes unitários para as funções
de carregamento e validação de configuração.
"""

import pytest
import tempfile
import yaml
from pathlib import Path
from typing import Dict, Any

from src.core.config_loader import load_config, validate_config, get_config_value


@pytest.fixture
def sample_config() -> Dict[str, Any]:
    """Sample configuration for testing."""
    return {
        "study_metadata": {
            "name": "Test Study",
            "version": "0.1.0"
        },
        "drone_parameters": {
            "max_payload_kg": 2.5,
            "max_range_km": 15.0,
            "cruise_speed_kmh": 45.0
        },
        "logistics_parameters": {
            "service_radius_km": 10.0
        },
        "economic_parameters": {
            "discount_rate": 0.08
        }
    }


@pytest.fixture
def config_file(sample_config: Dict[str, Any]) -> str:
    """Create a temporary config file for testing."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.yml', delete=False) as f:
        yaml.dump(sample_config, f)
        return f.name


def test_load_config_success(config_file: str) -> None:
    """Test successful configuration loading."""
    config = load_config(config_file)
    
    assert isinstance(config, dict)
    assert "study_metadata" in config
    assert "drone_parameters" in config
    assert config["drone_parameters"]["max_payload_kg"] == 2.5


def test_load_config_file_not_found() -> None:
    """Test error handling for missing config file."""
    with pytest.raises(FileNotFoundError):
        load_config("nonexistent_file.yml")


def test_validate_config_success(sample_config: Dict[str, Any]) -> None:
    """Test successful configuration validation."""
    # Should not raise any exception
    validate_config(sample_config)


def test_validate_config_missing_section() -> None:
    """Test validation failure for missing required section."""
    incomplete_config = {
        "study_metadata": {
            "name": "Test"
        }
        # Missing required sections
    }
    
    with pytest.raises(ValueError, match="Required configuration section missing"):
        validate_config(incomplete_config)


def test_validate_config_invalid_drone_parameter() -> None:
    """Test validation failure for invalid drone parameters."""
    config_with_invalid_param = {
        "study_metadata": {"name": "Test"},
        "drone_parameters": {
            "max_payload_kg": -1.0,  # Invalid negative value
            "max_range_km": 15.0,
            "cruise_speed_kmh": 45.0
        },
        "logistics_parameters": {"service_radius_km": 10.0},
        "economic_parameters": {"discount_rate": 0.08}
    }
    
    with pytest.raises(ValueError, match="Invalid drone parameter"):
        validate_config(config_with_invalid_param)


def test_get_config_value_success(sample_config: Dict[str, Any]) -> None:
    """Test successful nested config value retrieval."""
    value = get_config_value(sample_config, "drone_parameters.max_payload_kg")
    assert value == 2.5


def test_get_config_value_with_default(sample_config: Dict[str, Any]) -> None:
    """Test config value retrieval with default."""
    value = get_config_value(sample_config, "nonexistent.key", default=42)
    assert value == 42


def test_get_config_value_nested_missing(sample_config: Dict[str, Any]) -> None:
    """Test config value retrieval for missing nested key."""
    value = get_config_value(sample_config, "drone_parameters.nonexistent_param")
    assert value is None


# Cleanup fixture
@pytest.fixture(autouse=True)
def cleanup_temp_files(config_file: str) -> None:
    """Clean up temporary files after tests."""
    yield
    Path(config_file).unlink(missing_ok=True)
