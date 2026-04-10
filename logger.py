from loguru import logger
import sys
from pathlib import Path


LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)


logger.remove()


logger.add(
    sys.stdout,
    level="INFO",
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
           "<level>{level}</level> | "
           "<cyan>{name}</cyan>:<cyan>{function}</cyan> - "
           "<level>{message}</level>"
)


logger.add(
    LOG_DIR / "app.log",
    rotation="1 MB",        
    retention="7 days",     
    compression="zip",      
    level="DEBUG",
    format="{time} | {level} | {name}:{function} - {message}"
)

def get_logger():
    return logger