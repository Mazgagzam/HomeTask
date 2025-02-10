const NEURON_COUNT = 100
const CONNECTION_PROBABILITY = 0.03
const NEURON_RADIUS = 2
const PULSE_SPEED = 0.005
const NEW_PULSE_PROBABILITY = 0.1
const NEURON_SPEED = 0.2

class Neuron {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.connections = []
    this.vx = (Math.random() - 0.5) * NEURON_SPEED
    this.vy = (Math.random() - 0.5) * NEURON_SPEED
  }

  move(width, height) {
    this.x += this.vx
    this.y += this.vy

    if (this.x <= 0 || this.x >= width) {
      this.vx = -this.vx
    }
    if (this.y <= 0 || this.y >= height) {
      this.vy = -this.vy
    }

    this.x = Math.max(0, Math.min(width, this.x))
    this.y = Math.max(0, Math.min(height, this.y))
  }
}

class Pulse {
  constructor(start, end) {
    this.start = start
    this.end = end
    this.progress = 0
  }
}

class NeuralNetwork {
  constructor() {
    this.canvas = document.getElementById("neuralNetworkCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.neurons = []
    this.pulses = []
    this.gradient = null

    this.resizeCanvas()
    window.addEventListener("resize", () => this.resizeCanvas())

    this.initializeNeurons()
    this.createConnections()
    this.createGradient()
    this.animate()
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.createGradient()
  }

  initializeNeurons() {
    for (let i = 0; i < NEURON_COUNT; i++) {
      this.neurons.push(new Neuron(Math.random() * this.canvas.width, Math.random() * this.canvas.height))
    }
  }

  createConnections() {
    for (let i = 0; i < NEURON_COUNT; i++) {
      for (let j = i + 1; j < NEURON_COUNT; j++) {
        if (Math.random() < CONNECTION_PROBABILITY) {
          this.neurons[i].connections.push(j)
        }
      }
    }
  }

  createGradient() {
    this.gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height)
    this.gradient.addColorStop(0, "#4B0082")
    this.gradient.addColorStop(0.5, "#8A2BE2")
    this.gradient.addColorStop(1, "#9400D3")
  }

  animate() {
    this.ctx.fillStyle = this.gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.moveNeurons()
    this.drawConnections()
    this.drawNeurons()
    this.animatePulses()
    this.addNewPulses()

    requestAnimationFrame(() => this.animate())
  }

  moveNeurons() {
    this.neurons.forEach((neuron) => {
      neuron.move(this.canvas.width, this.canvas.height)
    })
  }

  drawConnections() {
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    this.ctx.lineWidth = 0.5
    this.neurons.forEach((neuron, i) => {
      neuron.connections.forEach((j) => {
        this.ctx.beginPath()
        this.ctx.moveTo(neuron.x, neuron.y)
        this.ctx.lineTo(this.neurons[j].x, this.neurons[j].y)
        this.ctx.stroke()
      })
    })
  }

  drawNeurons() {
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    this.neurons.forEach((neuron) => {
      this.ctx.beginPath()
      this.ctx.arc(neuron.x, neuron.y, NEURON_RADIUS, 0, Math.PI * 2)
      this.ctx.fill()
    })
  }

  animatePulses() {
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
    this.ctx.lineWidth = 2
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const pulse = this.pulses[i]
      pulse.progress += PULSE_SPEED

      if (pulse.progress > 1) {
        this.pulses.splice(i, 1)
        continue
      }

      const start = this.neurons[pulse.start]
      const end = this.neurons[pulse.end]
      const x = start.x + (end.x - start.x) * pulse.progress
      const y = start.y + (end.y - start.y) * pulse.progress

      this.ctx.beginPath()
      this.ctx.arc(x, y, NEURON_RADIUS * 1.5, 0, Math.PI * 2)
      this.ctx.stroke()
    }
  }

  addNewPulses() {
    if (Math.random() < NEW_PULSE_PROBABILITY) {
      const start = Math.floor(Math.random() * NEURON_COUNT)
      const neuron = this.neurons[start]
      if (neuron.connections.length > 0) {
        const end = neuron.connections[Math.floor(Math.random() * neuron.connections.length)]
        this.pulses.push(new Pulse(start, end))
      }
    }
  }
}

window.addEventListener("load", () => {
  new NeuralNetwork()
})

