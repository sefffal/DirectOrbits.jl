# DirectOrbits.jl

Tools for solving Keplerian orbits in the context of direct imaging.
The primary use case is mapping Keplerian orbital elements into Cartesian
coordinates at different times. A Plots.jl recipe is included for easily plotting orbits.

You can combine this package with Distributions.jl for uncertanties
in each parameter, and also one of the MCMC packages like AffineInvariantMCMC.jl
for sampling orbits. The performance of this package is quite good, so it 
is reasonable to generate millions of orbits drawn from Distributions.jl
as part of a orbital fit routine. Examples of this will be included here
in the future.

See also [DirectImages.jl](//github.com/sefffal/DirectImages.jl)


# Usage
```julia
elements = KeplarianElementsDeg(
    a = 1.0,
    i = 45,
    e = 0.25,
    τ = 0.0,
    μ = 1.0,
    ω = 0.0,
    Ω = 120.0,
    plx = 35.
)

# Display one full period of the orbit (requires `using Plots` before hand)
plot(orbit, label="My Planet")
```
![Orbit Plot](docs/orbit-sample.png)

Note that by default the horizontal axis is flipped to match how it would look in the sky. The horizontal coordinates generated by these functions are not flipped in this way. If you use these coordinates to sample an image, you will have to either flip the image or negate the $x$ coordinate.


Get an Cartesian coordinate at a given epoch as an SVector() from the StaticArrays package.
```julia
julia> pos = kep2cart(orbit, 1.0) # at time in MJD (modified Julian days)
3-element StaticArrays.SVector{3, Float64} with indices SOneTo(3):
  0.02003012254093835
  0.01072871196981525
 -0.019306398386215368
```


There are many convenience functions, including:
 - `period`
 - `distance`
 - `meanmotion`
 - `projectedseparation`
 - `raoff`
 - `decoff`
 - `losoff`

Showing an orbital elements object at the REPL will print a useful summary like this:
```julia
julia> elements
KeplarianElements{Float64}
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

SVectors are chosen for the return values for easy composition with `CoordinateTransforms.jl` and `ImageTransformations.jl` packages.


## Units & Conventions

The main constructor, `KeplarianElements`, accepts the following parameters:
- `a`: Semi-major axis in astronomical units (AU)
- `i`: Inclination in radians
- `e`: Eccentricity in the range [0, 1)
- `τ`: Epoch of periastron passage, days.
- `μ`: Graviataion parameter of the central body, expressed in units of Solar mass.
- `ω`: Argument of periastron
- `Ω`: Longitude of the ascending node, radians.
- `plx`: Distance to the system expressed in milliarcseconds of parallax.

Since conventions for `τ` vary, we do not impose any particular reference system. `τ` in days is essentiall just an offset on whatever `t` values you provide. If you are using a particular reference system and want `t` to be e.g. the current MJD, than `τ` should be
the epoch of periastron passage in MJD. Similarily, if you are using the convention that
`τ` is measured as a fraction of the orbital period at some reference epoch, you will have to calculate and make than conversion yourself.

Paramters can either be specified by position or as keyword arguments (but not a mix). Positional 
arguments are recommended if you are creating objects in a tight loop.

There is also a convenience constructor `KeplerianElementsDeg` that accepts `i`, `ω`, and `Ω` in units of degrees instead of radians.


See [this diagram](https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Orbit1.svg/1110px-Orbit1.svg.png) from Wikipedia as a reference for the conventions used by this package (note ♈︎ is replaced by the celestial North pole).

## Performance
On my 2017 Core i7 laptop, this library is able to calculate
a projected position from a set of orbital elements in just
45ns (circular orbit) or 270ns - 1.7 μs (moderate eccentricity).
It can even robustly solve highly eccentric orbits in under
a 3μs per position (e=0.99).

Sampling a position on a 2017 Core i7 laptop:
```julia
julia> el = KeplarianElements(
               a = 1,
               i = 0,
               e = 0,
               τ = 0,
               μ = 1,
               ω = 0,
               Ω = 0,
               plx = 1000,
           )
julia> @btime kep2cart($el, $0.0)
  45.390 ns (0 allocations: 0 bytes)
3-element StaticArrays.SVector{3, Float64} with indices SOneTo(3):
   0.0
 999.9999999921652
   0.0
```
