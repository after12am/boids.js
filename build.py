#!/usr/bin/python

"""
  We use closure-compiler in build process.
  There is no hindrance in develop. but closure-compiler
  is necessary for building release version.

  1. download latest from https://github.com/google/closure-compiler
  2. install closure-compiler.
  ```
    sudo mv compiler.jar /usr/local/bin/closure
  ```
"""

version = '1.2.9'
module = 'boids'
input_path = 'src/'
output_path = ['build/boids.js', 'example/scripts/boids.js']

import re, os, sys, time, tempfile

header = '''/*
 * boids.js
 * https://github.com/after12am/boids.js
 *
 * Copyright 2012-2016 Satoshi Okami
 * Released under the MIT license
 */
'''

def sources():
  filePaths = [
  	'src/core/math/Vector3.js',
    'src/boids.js',
    'src/core/Vehicle.js',
    'src/core/SteeredVehicle.js',
    'src/core/BiologicalVehicle.js',
    'src/object/MeshObject.js',
    'src/object/Bird.js'
  ]
  return filePaths

def compile(sources):
  return '\n'.join('// %s\n%s' % (path, open(path).read()) for path in sources)

def compress_source(text):
  def compress(match):
    text = match.group(0)
    if '  ' in text: # assume all strings with two consecutive spaces are glsl
      text = re.sub('/\*.*?\*/', '', text) # remove all comments
      text = re.sub(' +', ' ', text) # replace consecutive spaces with one space
      text = re.sub(r' ?(\+|\-|\*|/|,|=|{|}|;|\(|\)|<|>|!|\'|\") ?', r'\1', text) # tighten spaces around some tokens
    return text

  text = re.sub(r"('([^'\\]|\\(.|\n))*'|\"([^\"\\]|\\(.|\n))*\")", compress, text) # replace all strings
  return text

def build():
  data = 'var %s = (function() {\nvar exports = {VERSION: \'%s\'};\n\nexports.THREE = {};\n\n' % (module, version) + compile(sources()) + '\nreturn exports;\n})();\n'
  if 'release' in sys.argv:
    f1, temp1_path = tempfile.mkstemp()
    f2, temp2_path = tempfile.mkstemp()
    os.write(f1, data)
    os.close(f1)
    os.close(f2)
    os.system('java -jar /usr/local/bin/closure --js %s --js_output_file %s' % (temp1_path, temp2_path))
    os.remove(temp1_path)
    data = open(temp2_path).read()
    os.remove(temp2_path)
    data = compress_source(data)
  data = header + data
  for path in output_path:
    open(path, 'w').write(data)
    print 'built %s (%u lines)' % (path, len(data.split('\n')))

def gen_docs():
  os.system('npm run docs')

def stat():
  return [os.stat(file).st_mtime for file in sources()]

def monitor():
  a = stat()
  while True:
    time.sleep(0.5)
    b = stat()
    if a != b:
      a = b
      if 'debug' in sys.argv:
        build()
      if 'docs' in sys.argv:
        gen_docs()

if __name__ == '__main__':
  if 'docs' in sys.argv:
    monitor()
    sys.exit(0)
  build()
  if 'debug' in sys.argv:
    monitor()
