"""
Data validation utilities for the Drone-as-a-Service study.

Este módulo fornece funções para validar a integridade e qualidade
dos dados de entrada do estudo.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd
import numpy as np


def validate_data_files(config: Dict[str, Any]) -> None:
    """
    Validate that required data files exist and are accessible.
    
    Args:
        config: Configuration dictionary containing data paths
        
    Raises:
        FileNotFoundError: If required data files are missing
    """
    data_config = config.get("data_config", {})
    input_data_path = Path(data_config.get("input_data_path", "data/raw/"))
    
    # Check if data directory exists
    if not input_data_path.exists():
        raise FileNotFoundError(f"Data directory not found: {input_data_path}")
    
    # For now, just validate directory structure
    # In practice, you would validate specific data files here
    print(f"Data directory {input_data_path} exists and is accessible")


def validate_demand_data(
    demand_df: pd.DataFrame,
    required_columns: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Validate demand data DataFrame.
    
    Args:
        demand_df: DataFrame containing demand data
        required_columns: List of required column names
        
    Returns:
        Dictionary containing validation results and statistics
        
    Raises:
        ValueError: If validation fails
    """
    if required_columns is None:
        required_columns = ["timestamp", "origin_lat", "origin_lon", "dest_lat", "dest_lon"]
    
    validation_results = {
        "is_valid": True,
        "errors": [],
        "warnings": [],
        "statistics": {}
    }
    
    # Check required columns
    missing_columns = set(required_columns) - set(demand_df.columns)
    if missing_columns:
        validation_results["is_valid"] = False
        validation_results["errors"].append(f"Missing required columns: {missing_columns}")
    
    # Check for empty DataFrame
    if demand_df.empty:
        validation_results["is_valid"] = False
        validation_results["errors"].append("Demand data is empty")
        return validation_results
    
    # Validate coordinate ranges
    for col in ["origin_lat", "dest_lat"]:
        if col in demand_df.columns:
            lat_values = demand_df[col].dropna()
            if not lat_values.empty:
                if not (-90 <= lat_values.min() <= lat_values.max() <= 90):
                    validation_results["warnings"].append(f"Latitude values in {col} outside valid range [-90, 90]")
    
    for col in ["origin_lon", "dest_lon"]:
        if col in demand_df.columns:
            lon_values = demand_df[col].dropna()
            if not lon_values.empty:
                if not (-180 <= lon_values.min() <= lon_values.max() <= 180):
                    validation_results["warnings"].append(f"Longitude values in {col} outside valid range [-180, 180]")
    
    # Calculate statistics
    validation_results["statistics"] = {
        "total_records": len(demand_df),
        "missing_values": demand_df.isnull().sum().to_dict(),
        "date_range": None
    }
    
    # Calculate date range if timestamp column exists
    if "timestamp" in demand_df.columns:
        try:
            timestamps = pd.to_datetime(demand_df["timestamp"])
            validation_results["statistics"]["date_range"] = {
                "start": timestamps.min().isoformat(),
                "end": timestamps.max().isoformat()
            }
        except Exception as e:
            validation_results["warnings"].append(f"Could not parse timestamps: {e}")
    
    return validation_results


def validate_geographic_bounds(
    coordinates: pd.DataFrame,
    service_area_bounds: Optional[Dict[str, float]] = None
) -> Dict[str, Any]:
    """
    Validate that coordinates fall within expected service area bounds.
    
    Args:
        coordinates: DataFrame with lat/lon columns
        service_area_bounds: Dictionary with 'min_lat', 'max_lat', 'min_lon', 'max_lon'
        
    Returns:
        Dictionary containing validation results
    """
    validation_results = {
        "is_valid": True,
        "out_of_bounds_count": 0,
        "total_count": len(coordinates)
    }
    
    if service_area_bounds is None:
        # Default to reasonable bounds (e.g., São Paulo area)
        service_area_bounds = {
            "min_lat": -24.0,
            "max_lat": -23.0,
            "min_lon": -47.0,
            "max_lon": -46.0
        }
    
    # Check coordinates against bounds
    lat_col = None
    lon_col = None
    
    for col in coordinates.columns:
        if "lat" in col.lower():
            lat_col = col
        elif "lon" in col.lower():
            lon_col = col
    
    if lat_col and lon_col:
        out_of_bounds = (
            (coordinates[lat_col] < service_area_bounds["min_lat"]) |
            (coordinates[lat_col] > service_area_bounds["max_lat"]) |
            (coordinates[lon_col] < service_area_bounds["min_lon"]) |
            (coordinates[lon_col] > service_area_bounds["max_lon"])
        )
        
        validation_results["out_of_bounds_count"] = out_of_bounds.sum()
        
        if validation_results["out_of_bounds_count"] > 0:
            validation_results["is_valid"] = False
    
    return validation_results
