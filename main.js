// Get reference to Canvas
var canvas = document.getElementById('canvas');

// Get reference to Canvas Context
var context = canvas.getContext('2d');

// Initialize loading variables
var load_counter = 0;

// Initialize images for layers
var background = new Image();
var louze = new Image();
var stiny = new Image();
var kameny = new Image();
var kun = new Image();
var kytky = new Image();
var mince = new Image();
var text = new Image();

// Create a list of layer objects
// Each object contains the following:
// image: a reference to the image created above
// src: the path to the actual image in your project
// z_index: how close the object should appear in 3d space (0 is neutral)
// position: a place to keep track of the layer's current position
// blend: what blend mode you'd like the layer to use—default is null
// opacity: how transparent you'd like the layer to appear (0 is completely transparent, 1 is completely opaque)
var layer_list = [
	{
		'image': background,
		'src': './images/layer_1_1.png',
		'z_index': 0,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
    {
		'image': stiny,
		'src': './images/layer_3_1.png',
		'z_index': -2,
		'position': {x: 0, y: 0},
		'blend': 'multiply',
		'opacity': 1
	},
	{
		'image': louze,
		'src': './images/layer_2_1.png',
		'z_index': -2,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
    {
		'image': kun,
		'src': './images/layer_5_1.png',
		'z_index': 1,
		'position': {x: 0, y: 0},
		'blend': 'null',
		'opacity': 1
	},
	{
		'image': kameny,
		'src': './images/layer_4_1.png',
		'z_index': -0.5,
		'position': {x: 0, y: 0},
		'blend': 'overlay',
		'opacity': 1
	},
	
	{
		'image': kytky,
		'src': './images/layer_6_1.png',
		'z_index': 2,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': mince,
		'src': './images/layer_7_1.png',
		'z_index': -1,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	},
	{
		'image': text,
		'src': './images/layer_8_1.png',
		'z_index': 0,
		'position': {x: 0, y: 0},
		'blend': null,
		'opacity': 1
	}
];


// Go through the list of layer objects and load images from source
layer_list.forEach(function(layer, index) {
	layer.image.onload = function() {
		// Add 1 to the load counter
		load_counter += 1;
		// Checks if all the images are loaded
		if (load_counter >= layer_list.length) {
			// Start the render Loop!
			requestAnimationFrame(drawCanvas);
		}
	}
	layer.image.src = layer.src;
});


// Draw layers in Canvas
function drawCanvas() {		
	// Erase everything currently on the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	// Loop through each layer in the list and draw it to the canvas
	layer_list.forEach(function(layer, index) {
		
		// If the layer has a blend mode set, use that blend mode, otherwise use normal
		
        layer.position = getOffset(layer);
        
        if (layer.blend) {
			context.globalCompositeOperation = layer.blend;
		} else {
			context.globalCompositeOperation = 'normal';
		}
		
		// Set the opacity of the layer
		context.globalAlpha = layer.opacity;
		
		// Draw the layer into the canvas context
		context.drawImage(layer.image, layer.position.x, layer.position.y);
	});
	

	requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {
    var touch_multiplier = 0.3;
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplier; 
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

    var motion_multiplier = 2.5;
    var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
    var motion_offset_y = motion.y * layer.z_index * motion_multiplier;


    var offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
    };

    return offset;
}

//// TOUCH AND MOUSE CONTROLS

var moving = false;

// Initialize touch and mouse position
var pointer_initial = {
    x: 0,
    y: 0
};

var pointer = {
    x: 0,
    y: 0
};

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event) {
    moving = true;
    if (event.type === 'touchstart') {
        pointer_initial.x = event.touches[0].clientX;
        pointer_initial.y = event.touches[0].clientY;
    } else if (event.type ==='mousedown') {
        pointer_initial.x = event.clientX;
        pointer_initial.y = event.clientY;
    }
}

window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event) {
    event.preventDefault();
    if (moving === true) {
       var current_x = 0;
       var current_y = 0;
       if (event.type === 'touchmove') {
        current_x = event.touches[0].clientX;
        current_y = event.touches[0].clientY;
       } else if (event.type === 'mousemove') {
        current_x = event.clientX;
        current_y = event.clientY;
       }
       pointer.x = current_x - pointer_initial.x;
       pointer.y = current_y - pointer_initial.y;

    }
}

canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

canvas.addEventListener('mousemove', function(event) {
event.preventDefault();
});

window.addEventListener('touchend', function(event){
endGesture();
});

window.addEventListener('mousestop', function(evet){
    endGesture();
});

function endGesture() {
    moving = false;

    pointer.x = 0;
    pointer.y =0;
}


//// Motions Controls ////

// Initialuze variables for motion-based parallax
var motion_initial = {
    x: null,
    y: null
};

var motion = {
    x: 0,
    y: 0
};

//Losten to gyroscope events
window.addEventListener('deviceorientation', function(event) {
// if is the first time through
    if (!motion_initial.x && !motion_initial.y) {
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }

    if (window.orientation ===0) {
    //the device is in portrait orientation
        motion.x = event.gamma = motion_initial.y;
        motion.y = event.beta - motion_initial
    } else if (window.orientation === 90) {
    //the device is in landscape on its left side
        motion.x = event.beta - motion_initial.x;
        motion.y = -event.gamma + motion_initial.y;
    } else if (window.orientation === -90) {
    //the device is in landscape on its right side
        motion.x = event.beta + motion_initial.x;
        motion.y = event.gamma - motion_initial.y;
    } else {
    //the device is upside down
    motion.x = -event.gamma + motion_initial.y;
    motion.y = -event.beta + motion_initial.x;
    }

});

window.addEventListener('orientationchange', function(event) {
    motion_initial.x = 0;
    motion_initial.y = 0;
});