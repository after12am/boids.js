#!/usr/bin/env python

import re


def get_file_content(path):
	f = open(path)
	c = f.read()
	f.close()
	return c

def deleteComment(str):
	p = re.compile(r"/\*.*?\*/", re.DOTALL);
	return re.sub(p, "", str)

def main(p):
	content = "// github -> https://github.com/after12am/boids.js\n"
	content += "\n"
	content += "/* summarized content */\n"
	
	for p in paths:
		c = get_file_content(p)
		c = deleteComment(c)
		content += c + "\n"
	
	f = open("boids.build.js", "w")
	f.write(content)
	f.close()
	print content


	
paths = [
	'../src/boids.js',
	'../src/core/Vehicle.js',
	'../src/core/SteeredVehicle.js',
	'../src/core/BiologicalVehicle.js'
]

if __name__ == '__main__': main(paths)