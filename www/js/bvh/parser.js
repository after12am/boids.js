// original by https://github.com/mohayonao

Bvh.Parser = (function() {
    
    var Parser = (function() {
        var Parser = function() {
            initialize.apply(this, arguments);
        }, $this = Parser.prototype;
        
        var initialize = function(str) {
            var o;
            if (typeof(str) === "string") {
                o = bvhParse(str);
                this.bones     = o.bones;
                this.rootBone  = o.rootBone;
                this.numFrames = o.numFrames;
                this.frameTime = o.frameTime;
                this.frames    = o.frames;
            } else {
                this.bones     = [];
                this.rootBone  = null;
                this.numFrames = 0;
                this.frameTime = 0;
                this.frames    = 0;
            }
            this.isLoop = false;
        };
        
        $this.clone = function() {
            var newBvh, map;
            var srcBones, srcBone, srcChildren;
            var newBones, newBone, newChildren;
            var i, imax, j, jmax;
            
            newBvh = new Parser();
            map = {};
            
            srcBones = this.bones;      
            newBones = newBvh.bones;
            for (i = 0, imax = srcBones.length; i < imax; i++) {
                srcBone = srcBones[i];
                newBone = new BvhBone(srcBone.name);
                newBone.channels = srcBone.channels;
                newBone.offsetX = srcBone.offsetX;
                newBone.offsetY = srcBone.offsetY;
                newBone.offsetZ = srcBone.offsetZ;
                newBone.endOffsetX = srcBone.endOffsetX;
                newBone.endOffsetY = srcBone.endOffsetY;
                newBone.endOffsetZ = srcBone.endOffsetZ;
                newBone.Xposition = srcBone.Xposition;
                newBone.Yposition = srcBone.Yposition;
                newBone.Zposition = srcBone.Zposition;
                newBone.Xrotation = srcBone.Xrotation;
                newBone.Yrotation = srcBone.Yrotation;
                newBone.Zrotation = srcBone.Zrotation;
                newBone.numChannels = srcBone.numChannels;
                newBone.isEnd = srcBone.isEnd;
                newBones.push(newBone);
                map[newBone.name] = newBone;
                if (srcBone.parent === null) {
                    newBvh.rootBone = newBone;
                }
            }
            for (i = 0, imax = srcBones.length; i < imax; i++) {
                srcBone = srcBones[i];
                newBone = map[srcBone.name];
                if (srcBone.parent !== null) {
                    newBone.parent = map[srcBone.parent.name];
                }
                srcChildren = srcBone.children; 
                newChildren = newBone.children;
                for (j = 0, jmax = srcChildren.length; j < jmax; j++) {
                    newChildren.push(map[srcChildren[j].name]);
                }
            }
            newBvh.numFrames = this.numFrames;
            newBvh.frameTime = this.frameTime;
            newBvh.frames    = this.frames;
            return newBvh;
        };
        
        $this.gotoFrame = function(frame) {
            var numFrames, count, i, imax;
            frame = frame|0;
            numFrames = this.numFrames;
            if (!this.isLoop) {
                if (frame >= numFrames) frame = numFrames - 1;
            } else {
                while (frame >= numFrames) frame -= numFrames;
            }
            frame = this.frames[frame];
            for (i = 0, imax = frame.length; i < imax; i++) {
                this.setBoneProp(i, frame[i]);
            }
        };
        
        $this.setBoneProp = function(index, val) {
            var count, bones, bone, idx, i, imax;
            bones = this.bones;
            count = 0;
            for (i = 0, imax = bones.length; i < imax; i++) {
                bone = bones[i];
                count += bone.numChannels;
                if (count > index) {
                    idx = index - (count - bone.numChannels);
                    bone[bone.channels[idx]] = val;
                    break;
                }
            }
        };
        
        return Parser;
    }());
    
    
    var BvhBone = (function() {
        var BvhBone = function() {
            initialize.apply(this, arguments);
        }, $this = BvhBone.prototype = {
            get isRoot() { return this.parent === null; }
        };
        
        var initialize = function(name) {
            this.parent = null;
            this.channels = [];
            this.children = [];
            this.name = name;
            this.offsetX = this.offsetY = this.offsetZ = 0;
            this.endOffsetX = this.endOffsetY = this.endOffsetZ = 0;
            this.Xposition = this.Yposition = this.Zposition = 0;
            this.Xrotation = this.Yrotation = this.Zrotation = 0;
            this.numChannels = 0;
            this.isEnd = false;
        };
        
        $this.setOffset = function(value) {
            var items;
            items = value.split(/\s+/);
            if (items.length === 3) {
                this.offsetX = +items[0];
                this.offsetY = +items[1];
                this.offsetZ = +items[2];
            }
        };
        
        $this.setEndOffset = function(value) {
            var items;
            items = value.split(/\s+/);
            if (items.length === 3) {
                this.endOffsetX = +items[0];
                this.endOffsetY = +items[1];
                this.endOffsetZ = +items[2];
            }
        };
        
        $this.setChannels = function(value) {
            var items, ch;
            items = value.split(/\s+/);
            ch = items[0]|0;
            if (1 <= ch && ch <= 6) {
                this.numChannels = ch;
                this.channels = items.slice(1);
            }
            return ch;
        };
        
        $this.appendChild = function(child) {
            this.children.push(child);
            child.parent = this;
        };
        
        return BvhBone;
    }());
    
    
    var bvhParse = function(str) {
        var lines, l, i, imax;
        
        if (typeof(str) !== "string") return;
        lines = str.split("\n");
        
        // skip
        i = 0, imax = lines.length
        for (; i < imax; i++) {
            l = lines[i].trim();
            if (l === "HIERARCHY") break;
        }
        
        // read HIERARCHY
        var boneStack = [], bones = [];
        var rootBone, bone1, bone2, totalChannels;
        var m, isEnd = false;
        
        totalChannels = 0;
        for (i++; i < imax; i++) {
            l = lines[i].trim();
            if (l.length === 0) continue;
            if (l === "MOTION") {
                break;
            } else if ((m = /^ROOT\s+(.+)$/.exec(l)) !== null) {
                bone1 = rootBone = new BvhBone(m[1]);
                boneStack.push(bone1); bones.push(bone1);
            } else if ((m = /^JOINT\s+(.+)$/.exec(l)) !== null) {
                bone2 = new BvhBone(m[1]);
                bone1.appendChild(bone2);
                boneStack.push(bone1 = bone2); bones.push(bone1);
            } else if ((m = /^End\s+(.+)$/.exec(l)) !== null) {
                bone1.isEnd = isEnd = true;
            } else if ((m = /^OFFSET\s+(.+)$/.exec(l)) !== null) {
                if (bone1 !== null) {
                    if (isEnd) {
                        bone1.setEndOffset(m[1]);
                    } else {
                        bone1.setOffset(m[1]);
                    }
                }
            } else if ((m = /^CHANNELS\s+(.+)$/.exec(l)) !== null) {
                if (bone1 !== null) totalChannels += bone1.setChannels(m[1]);
            } else if (l === "}") {
                if (isEnd) {
                    isEnd = false;
                } else {
                    boneStack.pop();
                    bone1 = boneStack[boneStack.length-1] || rootBone;
                }
            }
        }
        
        // read MOTION
        var numFrames, frameTime, frames, items;
        numFrames = frameTime = 0;
        frames = [];
        for (i++; i < imax; i++) {
            l = lines[i].trim();
            if (l.length === 0) continue;
            if ((m = /^Frames:\s+(\d+)$/.exec(l)) !== null) {
                numFrames = +m[1];
                if (isNaN(numFrames)) numFrames = 0;
            } else if ((m = /^Frame Time:\s+([0-9.]+)$/.exec(l)) !== null) {
                frameTime = +m[1];
                if (isNaN(frameTime)) frameTime = 0;
            } else {
                items = l.split(/\s+/).map(function(x) { return +x; });
                if (items.length === totalChannels) {
                    frames.push(new Float32Array(items));
                }
            }
        }
        if (frames.length !== numFrames) {
            console.warn("frames.length="+frames.length, "numFrames=" + numFrames);
        }
        return { bones:bones, rootBone:rootBone,
                 numFrames:numFrames, frameTime:frameTime, frames:frames };
    };
    
    return Parser;
}());
