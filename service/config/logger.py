import logging
import logging.handlers
from config.config_definitions import config
import os

# Create handlers
c_handler = logging.StreamHandler()
c_handler.setLevel(logging.DEBUG)

# Create the logs folder if it does not exists
os.makedirs(os.path.dirname(config.logger_file_path), exist_ok=True)

f_handler = logging.handlers.TimedRotatingFileHandler(
    filename=config.logger_file_path,
    when=config.logger_file_rotate_when,
    interval=config.logger_file_rotate_interval,
    backupCount=config.logger_file_rotate_backup_count)
f_handler.setLevel(logging.INFO)

# Create formatters and add it to handlers
default_format = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s - %(args)s')
c_handler.setFormatter(default_format)
f_handler.setFormatter(default_format)


def createLogger(module_name: str):
    # Create a custom logger
    logger = logging.getLogger(module_name)
    # Setting the logger's root level to DEBUG
    logger.setLevel(logging.DEBUG)

    # Add handlers to the logger
    logger.addHandler(c_handler)
    logger.addHandler(f_handler)

    return logger
