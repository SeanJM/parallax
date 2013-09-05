# Parallax

A JavaScript script that allows you to add parallax animations to your web page

### Requirements
jQuery 1.9 or later

paralax.js

### Initial Setup
Include paralax.js in the document

    <script src="parallax.js"></script>

### Creating a parallax frame
All Parallax items must be included inside of a &lt;DIV&gt;. This &lt;DIV&gt; will
automatically be scaled to fullscreen resolution and will update when the window is
scaled.

#### Setting up the &lt;DIV&gt;

    <div parallax>[content]</div>

#### Creating an element that will be affected by scrolling
With parallax, any number based CSS attribute can be animated.
Eg: opacity, margin, padding, font-size, top, left, bottom, right, etc.

    <div parallax>
        <h1 parallaxanim="0% {font-size: 10px; top: 0%} 30% {font-size: 15px;} 100% {font-size: 20px; top: 50%}"></h1>
    </div>

You can add as many items that you want to be animated.

#### The License

###### The MIT License (MIT)

####### Copyright (c) 2013 Sean J. MacIsaac

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.