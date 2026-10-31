'use client'

import { useEffect, useRef, useState } from 'react'

const maxCanvasDimension = 1_920
const maxPixelRatio = 1
const initialSkyTime = 20.75
const feralSpeed = 0.264
const frameInterval = 1_000 / 30

const vertexShaderSource = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec3 mainColor;
uniform vec3 lowColor;
uniform vec3 middleColor;
uniform vec3 highColor;
uniform sampler2D noiseTexture;

const float fbmStrength = 0.912;
const float blurRadius = 1.2673;
const float zoom = 0.3971;
const float grainScale = 2.5;
const float grainStrength = 0.014;
const float wind = 0.144;
const float warp = 0.235;
const float noiseScale = 0.8675;

vec3 colorBurn(vec3 base, vec3 blend, float opacity) {
  return max(base + blend - vec3(1.0), vec3(0.0)) * opacity + base * (1.0 - opacity);
}

float random2d(vec2 point) {
  return fract(sin(dot(point, vec2(12.9898, 4.1414))) * 43758.5453);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 offset = fract(point);
  offset = offset * offset * (3.0 - 2.0 * offset);

  float bottom = mix(random2d(cell), random2d(cell + vec2(1.0, 0.0)), offset.x);
  float top = mix(
    random2d(cell + vec2(0.0, 1.0)),
    random2d(cell + vec2(1.0, 1.0)),
    offset.x
  );

  float noise = mix(bottom, top, offset.y);
  return noise * noise;
}

float fbm(vec2 point) {
  float value = 0.0;
  float amplitude = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rotation = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

  for (int index = 0; index < 4; index++) {
    value += amplitude * valueNoise(point);
    point = rotation * point * 2.0 + shift;
    amplitude *= 0.5;
  }

  return value;
}

vec4 permute(vec4 value) {
  return mod((value * 34.0 + 1.0) * value, 289.0);
}

vec4 inverseSquareRoot(vec4 value) {
  return 1.79284291400159 - 0.85373472095314 * value;
}

vec3 fade(vec3 value) {
  return value * value * value * (value * (value * 6.0 - 15.0) + 10.0);
}

float classicNoise(vec3 point) {
  vec3 cell0 = floor(point);
  vec3 cell1 = cell0 + vec3(1.0);
  cell0 = mod(cell0, 289.0);
  cell1 = mod(cell1, 289.0);

  vec3 offset0 = fract(point);
  vec3 offset1 = offset0 - vec3(1.0);
  vec4 x = vec4(cell0.x, cell1.x, cell0.x, cell1.x);
  vec4 y = vec4(cell0.yy, cell1.yy);
  vec4 z0 = vec4(cell0.z);
  vec4 z1 = vec4(cell1.z);
  vec4 xy = permute(permute(x) + y);
  vec4 xy0 = permute(xy + z0);
  vec4 xy1 = permute(xy + z1);

  vec4 gradientX0 = xy0 / 7.0;
  vec4 gradientY0 = fract(floor(gradientX0) / 7.0) - 0.5;
  gradientX0 = fract(gradientX0);
  vec4 gradientZ0 = vec4(0.5) - abs(gradientX0) - abs(gradientY0);
  vec4 step0 = step(gradientZ0, vec4(0.0));
  gradientX0 -= step0 * (step(vec4(0.0), gradientX0) - 0.5);
  gradientY0 -= step0 * (step(vec4(0.0), gradientY0) - 0.5);

  vec4 gradientX1 = xy1 / 7.0;
  vec4 gradientY1 = fract(floor(gradientX1) / 7.0) - 0.5;
  gradientX1 = fract(gradientX1);
  vec4 gradientZ1 = vec4(0.5) - abs(gradientX1) - abs(gradientY1);
  vec4 step1 = step(gradientZ1, vec4(0.0));
  gradientX1 -= step1 * (step(vec4(0.0), gradientX1) - 0.5);
  gradientY1 -= step1 * (step(vec4(0.0), gradientY1) - 0.5);

  vec3 gradient000 = vec3(gradientX0.x, gradientY0.x, gradientZ0.x);
  vec3 gradient100 = vec3(gradientX0.y, gradientY0.y, gradientZ0.y);
  vec3 gradient010 = vec3(gradientX0.z, gradientY0.z, gradientZ0.z);
  vec3 gradient110 = vec3(gradientX0.w, gradientY0.w, gradientZ0.w);
  vec3 gradient001 = vec3(gradientX1.x, gradientY1.x, gradientZ1.x);
  vec3 gradient101 = vec3(gradientX1.y, gradientY1.y, gradientZ1.y);
  vec3 gradient011 = vec3(gradientX1.z, gradientY1.z, gradientZ1.z);
  vec3 gradient111 = vec3(gradientX1.w, gradientY1.w, gradientZ1.w);

  vec4 normalization0 = inverseSquareRoot(vec4(
    dot(gradient000, gradient000),
    dot(gradient010, gradient010),
    dot(gradient100, gradient100),
    dot(gradient110, gradient110)
  ));
  gradient000 *= normalization0.x;
  gradient010 *= normalization0.y;
  gradient100 *= normalization0.z;
  gradient110 *= normalization0.w;

  vec4 normalization1 = inverseSquareRoot(vec4(
    dot(gradient001, gradient001),
    dot(gradient011, gradient011),
    dot(gradient101, gradient101),
    dot(gradient111, gradient111)
  ));
  gradient001 *= normalization1.x;
  gradient011 *= normalization1.y;
  gradient101 *= normalization1.z;
  gradient111 *= normalization1.w;

  float noise000 = dot(gradient000, offset0);
  float noise100 = dot(gradient100, vec3(offset1.x, offset0.yz));
  float noise010 = dot(gradient010, vec3(offset0.x, offset1.y, offset0.z));
  float noise110 = dot(gradient110, vec3(offset1.xy, offset0.z));
  float noise001 = dot(gradient001, vec3(offset0.xy, offset1.z));
  float noise101 = dot(gradient101, vec3(offset1.x, offset0.y, offset1.z));
  float noise011 = dot(gradient011, vec3(offset0.x, offset1.yz));
  float noise111 = dot(gradient111, offset1);
  vec3 fadeValue = fade(offset0);
  vec4 noiseZ = mix(
    vec4(noise000, noise100, noise010, noise110),
    vec4(noise001, noise101, noise011, noise111),
    fadeValue.z
  );
  vec2 noiseY = mix(noiseZ.xy, noiseZ.zw, fadeValue.y);

  return 2.2 * mix(noiseY.x, noiseY.y, fadeValue.x);
}

void main() {
  vec2 field = gl_FragCoord.xy / resolution - 0.5;
  field.x *= resolution.x / resolution.y;

  float animationTime = time * 0.85;
  vec2 position = field * (1.0 / (2.0 * zoom)) + 0.5;
  float noiseX = classicNoise(vec3(
    position * noiseScale + vec2(0.0, 74.8572),
    animationTime * 0.3
  ));
  float noiseY = classicNoise(vec3(
    position * noiseScale + vec2(203.91282, 10.0),
    animationTime * 0.3
  ));
  position += vec2(noiseX * 2.0, noiseY) * warp;

  float fineNoise = classicNoise(vec3(
    position * 18.0 + vec2(344.91282, 0.0),
    animationTime * 0.3
  ));
  fineNoise += classicNoise(vec3(
    position * 39.6 + vec2(723.937, 0.0),
    animationTime * 0.4
  )) * 0.5;
  position += fineNoise * 0.02;
  position.y -= 0.09;

  float textureMix = (sin(animationTime) + 1.0) * 0.5;
  vec2 texturePosition = position * grainScale;
  float grain0 = mix(
    texture2D(noiseTexture, texturePosition).r - 0.5,
    texture2D(noiseTexture, vec2(texturePosition.x, 1.0 - texturePosition.y)).g - 0.5,
    textureMix
  ) * grainStrength;
  texturePosition += vec2(63.861, 368.937);
  float grain1 = mix(
    texture2D(noiseTexture, texturePosition).r - 0.5,
    texture2D(noiseTexture, vec2(texturePosition.x, 1.0 - texturePosition.y)).g - 0.5,
    textureMix
  ) * grainStrength;
  texturePosition += vec2(453.163, 1649.808);
  float grain2 = mix(
    texture2D(noiseTexture, texturePosition).r - 0.5,
    texture2D(noiseTexture, vec2(texturePosition.x, 1.0 - texturePosition.y)).g - 0.5,
    textureMix
  ) * grainStrength;

  position += grain0;
  vec2 scaledPosition = position * noiseScale;
  vec2 cloudOffset = vec2(fbm(scaledPosition * 0.5 + wind * animationTime));
  vec2 cloudWarp = vec2(
    fbm(scaledPosition + cloudOffset + vec2(0.3, 9.2) + 0.15 * animationTime),
    fbm(scaledPosition + cloudOffset + vec2(8.3, 0.8) + 0.126 * animationTime)
  );
  float cloudField = fbm(scaledPosition + cloudWarp - cloudOffset);
  float cloudBody = (cloudField + 0.6 * cloudField * cloudField + 0.7 * cloudField + 0.5) * 0.5;
  cloudBody = pow(cloudBody, 0.55) * fbmStrength;

  float softenedRadius = blurRadius * 1.5;
  vec2 layerPosition0 = position + vec2((cloudBody - 0.5) * 1.2) + vec2(0.0, 0.025) + grain0;
  float layerNoise0 = valueNoise(layerPosition0 * 2.0 + vec2(0.0, animationTime * 0.5)) * 3.0;
  float layer0 = pow(smoothstep(
    layerNoise0 - 1.2 * softenedRadius,
    layerNoise0 + 1.2 * softenedRadius,
    (layerPosition0.y - 0.5) * 5.0 + 0.5
  ), 0.8);

  vec2 layerPosition1 = position + vec2((cloudBody - 0.5) * 0.85) + vec2(0.0, 0.025) + grain1;
  float layerNoise1 = valueNoise(layerPosition1 * 4.0 + vec2(293.0, animationTime)) * 2.8;
  float layer1 = pow(smoothstep(
    layerNoise1 - 0.9 * softenedRadius,
    layerNoise1 + 0.9 * softenedRadius,
    (layerPosition1.y - 0.6) * 5.0 + 0.5
  ), 0.9);

  vec2 layerPosition2 = position + vec2((cloudBody - 0.5) * 1.1) + grain2;
  float layerNoise2 = valueNoise(layerPosition2 * 6.0 + vec2(153.0, animationTime * 1.2)) * 2.6;
  float layer2 = smoothstep(
    layerNoise2 - 0.7 * softenedRadius,
    layerNoise2 + 0.7 * softenedRadius,
    (layerPosition2.y - 0.9) * 6.0 + 0.5
  );

  vec3 color = colorBurn(mainColor, lowColor, 1.0 - layer0);
  color = colorBurn(color, mix(mainColor, middleColor, 1.0 - layer1), layer0);
  color = mix(color, mix(mainColor, highColor, 1.0 - layer2), layer0 * layer1);

  gl_FragColor = vec4(color, 1.0);
}
`

export function SkyBackgroundCanvas({
  colors,
  isAnimationRunning,
  speed,
}: {
  colors: readonly string[]
  isAnimationRunning: boolean
  speed: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<ReturnType<typeof createSkyRenderer>>(null)
  const animationFrameRef = useRef<number | null>(null)
  const readyFrameRef = useRef<number | null>(null)
  const skyTimeRef = useRef(initialSkyTime)
  const colorsRef = useRef(colors)
  const [isReady, setIsReady] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    syncMotionPreference()
    mediaQuery.addEventListener('change', syncMotionPreference)

    return () => mediaQuery.removeEventListener('change', syncMotionPreference)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = createSkyRenderer(canvas)
    if (!renderer) return

    rendererRef.current = renderer
    renderer.setColors(colorsRef.current)

    const resize = () => {
      if (renderer.resize()) renderer.render(skyTimeRef.current)
    }
    const resizeObserver = new ResizeObserver(resize)

    resizeObserver.observe(canvas)
    renderer.resize()
    renderer.render(skyTimeRef.current)
    readyFrameRef.current = requestAnimationFrame(() => {
      readyFrameRef.current = null
      setIsReady(true)
    })

    return () => {
      if (readyFrameRef.current !== null) cancelAnimationFrame(readyFrameRef.current)
      resizeObserver.disconnect()
      renderer.destroy()
      rendererRef.current = null
    }
  }, [])

  useEffect(() => {
    if (colorsRef.current === colors) return

    colorsRef.current = colors
    const renderer = rendererRef.current
    if (!renderer) return

    renderer.setColors(colors)
    renderer.render(skyTimeRef.current)
  }, [colors])

  useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer) return

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (!isAnimationRunning || prefersReducedMotion) return

    let previousFrameTime = performance.now()
    let previousRenderTime = previousFrameTime
    const animate = (frameTime: number) => {
      const elapsedSeconds = Math.min(0.05, (frameTime - previousFrameTime) / 1_000)

      previousFrameTime = frameTime
      skyTimeRef.current += elapsedSeconds * feralSpeed * speed
      if (frameTime - previousRenderTime >= frameInterval) {
        previousRenderTime = frameTime
        renderer.render(skyTimeRef.current)
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [isAnimationRunning, prefersReducedMotion, speed])

  return (
    <div aria-hidden="true" className="site-sky-field" data-ready={isReady ? '' : undefined}>
      <canvas className="site-sky-field-canvas" ref={canvasRef} />
    </div>
  )
}

const createSkyRenderer = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
  })
  if (!context) return null

  // Keep WebGL's useProgram method from being mistaken for a React Hook.
  const activateProgram = context.useProgram.bind(context)
  const vertexShader = compileShader(context, context.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = compileShader(context, context.FRAGMENT_SHADER, fragmentShaderSource)
  if (!vertexShader || !fragmentShader) {
    if (vertexShader) context.deleteShader(vertexShader)
    if (fragmentShader) context.deleteShader(fragmentShader)
    return null
  }

  const program = context.createProgram()
  if (!program) {
    context.deleteShader(vertexShader)
    context.deleteShader(fragmentShader)
    return null
  }

  context.attachShader(program, vertexShader)
  context.attachShader(program, fragmentShader)
  context.bindAttribLocation(program, 0, 'position')
  context.linkProgram(program)
  context.deleteShader(vertexShader)
  context.deleteShader(fragmentShader)

  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    context.deleteProgram(program)
    return null
  }

  const positionBuffer = context.createBuffer()
  const noiseTexture = context.createTexture()
  if (!positionBuffer || !noiseTexture) {
    if (positionBuffer) context.deleteBuffer(positionBuffer)
    if (noiseTexture) context.deleteTexture(noiseTexture)
    context.deleteProgram(program)
    return null
  }

  activateProgram(program)
  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer)
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    context.STATIC_DRAW,
  )
  context.enableVertexAttribArray(0)
  context.vertexAttribPointer(0, 2, context.FLOAT, false, 0, 0)

  context.activeTexture(context.TEXTURE0)
  context.bindTexture(context.TEXTURE_2D, noiseTexture)
  context.texImage2D(
    context.TEXTURE_2D,
    0,
    context.RGBA,
    256,
    256,
    0,
    context.RGBA,
    context.UNSIGNED_BYTE,
    createNoiseTexture(),
  )
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.REPEAT)
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.REPEAT)
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR)
  context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR)
  context.uniform1i(context.getUniformLocation(program, 'noiseTexture'), 0)

  const resolutionLocation = context.getUniformLocation(program, 'resolution')
  const timeLocation = context.getUniformLocation(program, 'time')
  const mainColorLocation = context.getUniformLocation(program, 'mainColor')
  const lowColorLocation = context.getUniformLocation(program, 'lowColor')
  const middleColorLocation = context.getUniformLocation(program, 'middleColor')
  const highColorLocation = context.getUniformLocation(program, 'highColor')

  return {
    destroy: () => {
      context.deleteBuffer(positionBuffer)
      context.deleteTexture(noiseTexture)
      context.deleteProgram(program)
    },
    render: (time: number) => {
      context.viewport(0, 0, canvas.width, canvas.height)
      context.uniform2f(resolutionLocation, canvas.width, canvas.height)
      context.uniform1f(timeLocation, time)
      context.drawArrays(context.TRIANGLES, 0, 3)
    },
    resize: () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, maxPixelRatio)
      const desiredWidth = Math.max(1, Math.round(canvas.clientWidth * pixelRatio))
      const desiredHeight = Math.max(1, Math.round(canvas.clientHeight * pixelRatio))
      const renderScale = Math.min(1, maxCanvasDimension / Math.max(desiredWidth, desiredHeight))
      const width = Math.max(1, Math.round(desiredWidth * renderScale))
      const height = Math.max(1, Math.round(desiredHeight * renderScale))

      if (canvas.width === width && canvas.height === height) return false

      canvas.width = width
      canvas.height = height
      return true
    },
    setColors: (colors: readonly string[]) => {
      const palette = getSkyPalette(colors)

      context.uniform3fv(highColorLocation, palette.high)
      context.uniform3fv(mainColorLocation, palette.main)
      context.uniform3fv(middleColorLocation, palette.middle)
      context.uniform3fv(lowColorLocation, palette.low)
    },
  }
}

const compileShader = (context: WebGLRenderingContext, type: number, source: string) => {
  const shader = context.createShader(type)
  if (!shader) return null

  context.shaderSource(shader, source)
  context.compileShader(shader)

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    context.deleteShader(shader)
    return null
  }

  return shader
}

const createNoiseTexture = () => {
  const pixels = new Uint8Array(256 * 256 * 4)
  let seed = 17_429

  for (let index = 0; index < pixels.length; index += 4) {
    seed = (seed * 1_664_525 + 1_013_904_223) >>> 0
    const value = seed >>> 24

    pixels[index] = value
    pixels[index + 1] = value
    pixels[index + 2] = value
    pixels[index + 3] = 255
  }

  return pixels
}

const getSkyPalette = (colors: readonly string[]) => {
  const sortedColors = colors
    .map(color => ({ color, luminance: getLuminance(color) }))
    .sort((first, second) => second.luminance - first.luminance)
    .map(({ color }) => hexToNormalizedRgb(color))

  return {
    high: sortedColors[0],
    low: sortedColors[sortedColors.length - 1],
    main: sortedColors[Math.min(1, sortedColors.length - 1)],
    middle: sortedColors[Math.min(2, sortedColors.length - 1)],
  }
}

const getLuminance = (hex: string) => {
  const [red, green, blue] = hexToNormalizedRgb(hex)

  return red * 0.299 + green * 0.587 + blue * 0.114
}

const hexToNormalizedRgb = (hex: string) => {
  return new Float32Array([
    Number.parseInt(hex.slice(1, 3), 16) / 255,
    Number.parseInt(hex.slice(3, 5), 16) / 255,
    Number.parseInt(hex.slice(5, 7), 16) / 255,
  ])
}
