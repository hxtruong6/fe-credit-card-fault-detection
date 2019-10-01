import pip
from pip._internal import main


def install(package):
    if hasattr(pip, 'main'):
        pip.main(['install', package])
    else:
        main(['install', package])

# Example
if __name__ == '__main__':
    install('argh')