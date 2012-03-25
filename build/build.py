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
	content = "/* summarized content */\n"
	content += """
/********************************************************************************** 

 Copyright (C) 2012 satoshi okami

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do
 so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 **********************************************************************************/
"""
	
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
]

if __name__ == '__main__': main(paths)