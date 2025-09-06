#!/usr/bin/env python3
"""
Main CLI entry point for Drone-as-a-Service feasibility study.

Este script serve como ponto de entrada principal para executar
diferentes componentes do estudo via linha de comando.
"""

import argparse
import sys
from pathlib import Path
from typing import Optional

import yaml

from ..core.config_loader import load_config
from ..core.data_validator import validate_data_files


def main() -> None:
    """Main entry point for the CLI application."""
    parser = argparse.ArgumentParser(
        description="Drone-as-a-Service Feasibility Study CLI"
    )
    
    parser.add_argument(
        "--config",
        type=str,
        default="configs/study_config.yml",
        help="Path to configuration file (default: configs/study_config.yml)",
    )
    
    parser.add_argument(
        "--validate-data",
        action="store_true",
        help="Validate input data files",
    )
    
    parser.add_argument(
        "--run-analysis",
        action="store_true",
        help="Run the full feasibility analysis",
    )
    
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable verbose logging",
    )
    
    args = parser.parse_args()
    
    try:
        # Load configuration
        if args.verbose:
            print(f"Loading configuration from {args.config}")
        
        config = load_config(args.config)
        
        if args.validate_data:
            print("Validating data files...")
            validate_data_files(config)
            print("Data validation completed successfully.")
        
        if args.run_analysis:
            print("Running feasibility analysis...")
            # TODO: Implement full analysis pipeline
            print("Analysis pipeline not yet implemented.")
            
        if not args.validate_data and not args.run_analysis:
            print("No action specified. Use --help for available options.")
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
