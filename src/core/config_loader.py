"""
Configuration loading utilities for the Drone-as-a-Service study.

Este módulo fornece funções para carregar e validar arquivos
de configuração YAML do estudo.
"""

from pathlib import Path
from typing import Any, Dict

import yaml


def load_config(config_path: str) -> Dict[str, Any]:
    """
    Load configuration from YAML file.
    
    Args:
        config_path: Path to the YAML configuration file
        
    Returns:
        Dictionary containing configuration parameters
        
    Raises:
        FileNotFoundError: If configuration file doesn't exist
        yaml.YAMLError: If YAML parsing fails
    """
    config_file = Path(config_path)
    
    if not config_file.exists():
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    
    try:
        with open(config_file, "r", encoding="utf-8") as file:
            config = yaml.safe_load(file)
            
        if not isinstance(config, dict):
            raise ValueError("Configuration file must contain a valid YAML dictionary")
            
        return config
        
    except yaml.YAMLError as e:
        raise yaml.YAMLError(f"Error parsing YAML file {config_path}: {e}")


def validate_config(config: Dict[str, Any]) -> None:
    """
    Validate configuration parameters.
    
    Args:
        config: Configuration dictionary to validate
        
    Raises:
        ValueError: If required configuration parameters are missing or invalid
    """
    required_sections = [
        "study_metadata",
        "drone_parameters", 
        "logistics_parameters",
        "economic_parameters"
    ]
    
    for section in required_sections:
        if section not in config:
            raise ValueError(f"Required configuration section missing: {section}")
    
    # Validate drone parameters
    drone_params = config["drone_parameters"]
    required_drone_params = ["max_payload_kg", "max_range_km", "cruise_speed_kmh"]
    
    for param in required_drone_params:
        if param not in drone_params:
            raise ValueError(f"Required drone parameter missing: {param}")
        if not isinstance(drone_params[param], (int, float)) or drone_params[param] <= 0:
            raise ValueError(f"Invalid drone parameter {param}: must be positive number")


def get_config_value(config: Dict[str, Any], key_path: str, default: Any = None) -> Any:
    """
    Get nested configuration value using dot notation.
    
    Args:
        config: Configuration dictionary
        key_path: Dot-separated path to the configuration value (e.g., "drone_parameters.max_payload_kg")
        default: Default value if key not found
        
    Returns:
        Configuration value or default
        
    Example:
        >>> config = {"drone_parameters": {"max_payload_kg": 2.5}}
        >>> get_config_value(config, "drone_parameters.max_payload_kg")
        2.5
    """
    keys = key_path.split(".")
    value = config
    
    try:
        for key in keys:
            value = value[key]
        return value
    except (KeyError, TypeError):
        return default
