# DirectOrbits.jl

Tools for solving Keplerian orbits in the context of direct imaging.
The primary use case is mapping Keplerian orbital elements into Cartesian
coordinates at different times. A Plots.jl recipe is included for easily plotting orbits.

Among other values, it calculates the projected positions of planets, as well as stellar radial velocity and proper motion anomaly. It's a great tool for visualizing different orbits (see examples) and generating nice animations (e.g. with Plots or Luxor.jl).

This package has been designed for good performance and composability with a wide range of packages in the Julia ecosystem, including ForwardDiff. 

To fit orbits to observations, see [DirectDetections.jl](//github.com/sefffal/DirectDetections.jl).

See also [DirectImages.jl](//github.com/sefffal/DirectImages.jl).

## Usage
```julia
using DirectOrbits

# See below for units and conventions on these parameters.
elements = KeplerianElementsDeg(a=1, i=45, e=0.25, τ=0, μ=1, ω=0, Ω=120, plx=35)

# Display one full period of the orbit (run `using Plots` first)
plot(elements, label="My Planet")
```
![Orbit Plot](docs/orbit-sample.png)

Note that by default the horizontal axis is flipped to match how it would look in the sky. The horizontal coordinates generated by these functions are not flipped in this way. If you use these coordinates to sample an image, you will have to either flip the image or negate the $x$ coordinate.

If you have an array of hundreds or thousands of orbits you want to visualize, just pass that array to `plot`. The opacity of the orbits will be reduced an appropriate amount.


Get projected cartesian coordinates in milliarcseconds at a given epoch:
```julia
julia> pos = kep2cart(elements, 1.0) # at t time in days 
ComponentVector{Float64,typename(StaticArrays.SArray)...}(
    x = 19.583048010319406,  # mas
    y = 11.394360378798881,  # mas
    z = -19.659329553074404, # mas
    ẋ = 19.583048010319406,  # mas/year
    ẏ = 11.394360378798881,  # mas/year
    ż = 13602.351794764198   # m/s
)
```


There are many convenience functions, including:
 - `period(elements)`:  period of a the companion in days.
 - `distance(elements)`:  distance to the system in pc
 - `meanmotion(elements)`: mean motion about the primary in radians/yr
 - `projectedseparation(elements, t)`: given orbital elements and a time, the projected separation between the primary and companion
 - `raoff(elements, t)`: as above, but only the offset in Right Ascension (milliarcseconds)
 - `decoff(elements, t)`: as above, but only the offset in declination (milliarcseconds)
- `radvel`: radial velocity in m/s of the planet or star (see docstring)
- `propmotionanom`: proper motion anomaly of the star due to the planet in milliarseconds / year

Showing an orbital elements object at the REPL will print a useful summary like this:
```julia
julia> elements
KeplerianElements{Float64}
─────────────────────────
a   [au ] = 1.0
i   [°  ] = 45.0
e         = 0.25
τ         = 0.0
μ   [M⊙ ] = 1.0
ω   [°  ] = 0.0
Ω   [°  ] = 120.0
plx [mas] = 35.0
──────────────────────────
period      [yrs ] : 1.0
distance    [pc  ] : 28.6
mean motion [°/yr] : 360.0
```

ComponentVectors wrapping SVectors are chosen for the return values. They are stack allocated and allow access by property
name, and behave as arrays. This makes it easy to compose with other packages.


## Units & Conventions

The main constructor, `KeplerianElements`, accepts the following parameters:
- `a`: Semi-major axis in astronomical units (AU)
- `i`: Inclination in radians
- `e`: Eccentricity in the range [0, 1)
- `τ`: Epoch of periastron passage, in fraction of orbit [0,1]
- `μ`: Graviataion parameter of the central body, expressed in units of Solar mass.
- `ω`: Argument of periastron
- `Ω`: Longitude of the ascending node, radians.
- `plx`: Distance to the system expressed in milliarcseconds of parallax.

Thee parameter `τ` represents the epoch of periastron passage as a  fraction of the planet's orbit between 0 and 1. This follows the same convention as Orbitize! and you can read more about their choice in ther FAQ.

Parameters can either be specified by position or as keyword arguments (but not a mix). Positional 
arguments are recommended if you are creating objects in a tight loop.

There is also a convenience constructor `KeplerianElementsDeg` that accepts `i`, `ω`, and `Ω` in units of degrees instead of radians.


See [this diagram](https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Orbit1.svg/1110px-Orbit1.svg.png) from Wikipedia as a reference for the conventions used by this package (note ♈︎ is replaced by the celestial North pole).

## Installation

This package is not yet registered, so to install it, you must specify this repository.

From a Julia prompt, type `]` followed by `add https://github.com/sefffal/DirectOrbits.jl.git`

Alternatively, run `using Pkg; Pkg.add("https://github.com/sefffal/DirectOrbits.jl.git")`

That's it! If you want to run it through a gauntlet of tests, type `]` followed by `test DirectOrbits`

## Performance
On my 2017 Core i7 laptop, this library is able to calculate
a projected position from a set of orbital elements in just 48ns (circular orbit) or 166ns (eccentric).

All the helper functions should work without any heap allocations
when using standard numeric types.

Several parameters are pre-calculated when creating a KeplerianElements object. There is
therefore a slight advantage to re-use the same object if you are sampling many positions
from the same orbital elements (but we are only talking nanoseconds either way).

## Numerical Derivatives
This package works well with the autodiff package ForwardDiff.jl. For example:

```julia
using ForwardDiff
ForwardDiff.derivative(t -> radvel(elements, t), 123.0)
```

This has only a negligible overhead (maybe 15%) compared to calculating the value itself.
If you need access to both the value and the derivative, I recommend you use the DiffResults
package to calculate both at once for a 2x speedup:
```julia
using DiffResults
g = let elements=elements
    t -> raoff(elements, t)
end

# Set the result type
result_out = DiffResults.DiffResult(1.0,1.0)

# Calculate both the value and derivative at once
@btime res = ForwardDiff.derivative!($result_out, $g, 1.0)
#  205.487 ns (0 allocations: 0 bytes)

# Access each
rv = DiffResults.value(res)
drvdt = DiffResults.derivative(res, Val{1})
```

The Zygote reverse diff package does not currently work with DirectOrbits.jl.

## Symbolic Manipulation
There is some support for using the Symbolics.jl package. You can create symbolic variables and trace most of the functions defined in this package to get symbolic expressions. 
This is a little slow, and I'm not sure of the applications, but it's neat that it works.

```julia
using Symbolics
@variables t
expr = radvel(elements, t);
```
This works with the KeplerianElements constructors as well if you want to create
a full symbolic set of elements.