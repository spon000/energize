import time
import threading
import logging
import concurrent.futures as cf

def thread_function(name):
  logging.info(f"Thread {name}: starting")
  time.sleep(10)
  logging.info(f"Thread {name}: ending")


if __name__ == '__main__':
  format = "%(asctime)s: %(message)s"
  logging.basicConfig(format=format, level=logging.INFO, datefmt="%H:%M:%S")

  with cf.ThreadPoolExecutor(max_workers=3) as executor:
    executor.map(thread_function, range(3))

  