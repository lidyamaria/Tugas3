let planets = []
let sun = 1
let numPlanets = 8
let G = 150
let destabilise = 0.15

function setup() {
  createCanvas(450,450)
  sun = new Body(30,createVector(10,0),createVector(0,0))

  for (let i = 0; i < numPlanets; i++) {
    let mass = random(7, 8)
    let radius = random(sun.d, min(windowWidth/2,windowHeight/2))
    let angle = random(0, TWO_PI)
    let planetPos = createVector(radius * cos(angle), radius * sin(angle))

    let planetVel = planetPos.copy()
    if (random(8) < 1) planetVel.rotate(-HALF_PI)
    else planetVel.rotate(HALF_PI)  // Direction of orbit
    planetVel.normalize()
    planetVel.mult( sqrt((G * sun.mass)/(radius)) ) // Circular orbit velocity
    planetVel.mult( random( 1-destabilise, 1+destabilise) )       // create elliptical orbit

    planets.push( new Body(mass, planetPos, planetVel) )
  }
}

function draw() {
  background(100,149,237)
  translate(width/2, height/2)
  
  for (let i = numPlanets-1; i >= 0; i--) {
   
    sun.attract(planets[i])
    planets[i].move(4)
    planets[i].show(4)
  }
  sun.show(1)
}


function Body(_mass, _pos, _vel){
  this.mass = _mass
  this.pos = _pos
  this.vel = _vel
  this.d = this.mass*2
  this.thetaInit = 0
  this.path = []
  this.pathLen = Infinity

  this.show = function() {
    stroke(50,10)
    for (let i = 0; i < this.path.length-2; i++) {
      line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y,)
    }
    fill(48,206,209); noStroke()
    ellipse(this.pos.x, this.pos.y, this.d, this.d)
  }


  this.move = function() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.path.push(createVector(this.pos.x,this.pos.y))
    if (this.path.length > 200) this.path.splice(0,1)
  }

  this.applyForce = function(f) {
    this.vel.x += f.x / this.mass
    this.vel.y += f.y / this.mass
  }

  this.attract = function(child) {
    let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y)
    let f = (this.pos.copy()).sub(child.pos)
    f.setMag( (G * this.mass * child.mass)/(r * r) )
    child.applyForce(f)
  }

}