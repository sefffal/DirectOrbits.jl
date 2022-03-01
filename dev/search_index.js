var documenterSearchIndex = {"docs":
[{"location":"symbolics/#Symbolic-Manipulation","page":"Symbolic Manipulation","title":"Symbolic Manipulation","text":"","category":"section"},{"location":"symbolics/","page":"Symbolic Manipulation","title":"Symbolic Manipulation","text":"The Symbolics.jl package works fairly well out of the box with DirectOrbits.jl. You can create fully or partially symbolic KeplerianElements and/or solve for orbits at a time or true anomaly given by a symbolic t. This could come in use in a few scenarios. For example, if you have an orbit with all parameters known except inclination, you could construct a set of elements with i as a symbolic variable. Solving the orbit using orbitsolve would then return a solution with simplified symbolic expressions of i that can be evaluated very efficiently for different values. N.B. this approach is quite messy for a symbolic e since Kepler's equation is trancendental.","category":"page"},{"location":"symbolics/","page":"Symbolic Manipulation","title":"Symbolic Manipulation","text":"There is some support for using the Symbolics.jl package. You can create symbolic variables and trace most of the functions defined in this package to get symbolic expressions.  This is a little slow, and I'm not sure of the applications, but it's neat that it works.","category":"page"},{"location":"symbolics/","page":"Symbolic Manipulation","title":"Symbolic Manipulation","text":"using Symbolics\n@variables t\nexpr = radvel(elements, t);","category":"page"},{"location":"symbolics/","page":"Symbolic Manipulation","title":"Symbolic Manipulation","text":"This works with the KeplerianElements constructors as well if you want to create a full symbolic set of elements.","category":"page"},{"location":"api/#API-Documentation","page":"API","title":"API Documentation","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"KeplerianElements\nDirectOrbits.astuple\nKeplerianElementsDeg\norbitsolve\nDirectOrbits.orbitsolve_ν\nOrbitSolution\nperiod\ndistance\nmeanmotion\nperiastron\nraoff\ndecoff\nposangle\nprojectedseparation\npropmotionanom\nradvel\nacceleration","category":"page"},{"location":"api/#DirectOrbits.KeplerianElements","page":"API","title":"DirectOrbits.KeplerianElements","text":"KeplerianElements(\n    a, # semi-major axis [AU]\n    e, # eccentricity\n    i, # inclination [rad]\n    ω, # argument of periapsis [rad]\n    Ω, # longitude of ascending node [rad]\n    τ, # epoch of periastron passage at MJD=0\n    M, # mass of primary [M⊙]\n    plx, # parallax [mas]; defines the distance to the primary\n)\n\nRepresents the Keplerian elements of a secondary body orbiting a primary. Values can be specified by keyword argument or named tuple for convenience.\n\nSee also KeplerianElementsDeg for a convenience constructor accepting units of degrees instead of radians for i, ω, and Ω.\n\n\n\n\n\n","category":"type"},{"location":"api/#DirectOrbits.astuple","page":"API","title":"DirectOrbits.astuple","text":"astuple(elements)\n\nReturn the parameters of a KeplerianElements value as a tuple.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.KeplerianElementsDeg","page":"API","title":"DirectOrbits.KeplerianElementsDeg","text":"KeplerianElementsDeg(a, e, i, ω, Ω, τ, M, plx)\n\nA convenience function for constructing KeplerianElements where i, ω, and Ω are provided in units of degrees instead of radians.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.orbitsolve","page":"API","title":"DirectOrbits.orbitsolve","text":"orbitsolve(elements, t)\n\nGiven a set of orbital elements with a time t in days, get the position and velocity of the secondary body (e.g. planet around a star).\n\nThis will output an OrbitSolution struct with the following properties:\n\nx: δ right ascension [mas]\ny: δ declination [mas]\nẋ: right ascension proper motion anomaly [mas/year]\nẏ: declination proper motion anomaly [mas/year]\nż: radial velocity of the secondary [m/s]\nẍ: right ascension acceleration [mas/year^2]\nÿ: declination acceleration [mas/year^2]\n\nYou can access the properties by name .x. There are helper functions to calculate each of these properties individually, but if you need more than one it is most efficient to calculate them in one go.\n\nradvel can optionally accept the mass of the primary to calculate the impact of the secondary body on radial velocity of the primary, instead of the radial velocity of the secondary body itself.\n\nNote: these calculations use the small angle approximation, so are only accurate when  the star is much further way from the observer than the secondary is from the primary.\n\nSee also: orbitsolve_ν, projectedseparation, raoff, decoff, radvel, propmotionanom.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.orbitsolve_ν","page":"API","title":"DirectOrbits.orbitsolve_ν","text":"orbitsolve_ν(elem, ν)\n\nSolve a keplerian orbit from a given true anomaly [rad]. See orbitsolve for the same function accepting a given time.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.OrbitSolution","page":"API","title":"DirectOrbits.OrbitSolution","text":"OrbitSolution(\n    x, # δ right ascension [mas]\n    y, # δ declination [mas]\n    ẋ, # right ascension proper motion anomaly [mas/year]\n    ẏ, # declination proper motion anomaly [mas/year]\n    ż, # radial velocity of the *secondary* [m/s]\n    ẍ, # right ascension acceleration [mas/year^2]\n    ÿ, # declination acceleration [mas/year^2]\n    elem, # KeplerianElements representing the orbit of this body \n)\n\nRepresents the secondary's position on the sky in terms of offset from the primary, its velocity and acceleration on the sky, and its radial velocity. Conceptually, this is a KeplerianElements evaluated to some position.\n\n\n\n\n\n","category":"type"},{"location":"api/#DirectOrbits.period","page":"API","title":"DirectOrbits.period","text":"period(elem)\n\nPeriod of an orbit [days].\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.distance","page":"API","title":"DirectOrbits.distance","text":"distance(elem)\n\nDistance to the system [pc].\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.meanmotion","page":"API","title":"DirectOrbits.meanmotion","text":"meanmotion(elem)\n\nMean motion [rad/year].\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.periastron","page":"API","title":"DirectOrbits.periastron","text":"periastron(elements, tref=58849)\n\nCompute the MJD of periastron passage most recently after the reference epoch tref. N.B. mjd of 58849 = 2020-01-01\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.raoff","page":"API","title":"DirectOrbits.raoff","text":"raoff(elem, t)\n\nGet the offset [mas] from the primary body in Right Ascension at the time t [days].\n\nraoff(o)\n\nGet the offset [mas] from the primary body in Right Ascension  from an instance of OrbitSolution.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.decoff","page":"API","title":"DirectOrbits.decoff","text":"decoff(elem, t)\n\nGet the offset [mas] from the primary body in Declination at the time t [days].\n\ndecoff(elem, t)\n\nGet the offset [mas] from the primary body in Declination from an instance of OrbitSolution.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.posangle","page":"API","title":"DirectOrbits.posangle","text":"posangle(elem, t)\n\nCalculate the position angle [rad] of the secondary about its primary from our perspective at the time t [days].\n\nposangle(o)\n\nCalculate the position angle [rad] of the secondary about its primary from our perspective from an instance of OrbitSolution.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.projectedseparation","page":"API","title":"DirectOrbits.projectedseparation","text":"projectedseparation(elem, t)\n\nCalculate the projected separation [mas] of the secondary from its primary at the time t [days].\n\nprojectedseparation(o)\n\nCalculate the projected separation [mas] of the secondary from its primary from an instance of OrbitSolution.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.propmotionanom","page":"API","title":"DirectOrbits.propmotionanom","text":"propmotionanom(elem, t)\n\nGet the instantaneous proper motion anomaly [mas/year] of the secondary at the time t [days].\n\npropmotionanom(o)\n\nGet the instantaneous proper motion anomaly [mas/year] of the secondary from an instance of OrbitSolution.\n\n\n\n\n\npropmotionanom(elem, t, M_planet)\n\nGet the instantaneous proper motion anomaly [mas/year] of  the primary in at the time t [days]. The units of M_planet and elem.M must match.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.radvel","page":"API","title":"DirectOrbits.radvel","text":"radvel(elem, t)\n\nGet the radial velocity [m/s] of the secondary along the line of sight at the time t [days].\n\nradvel(o)\n\nGet the radial velocity [m/s] of the secondary along the line of sight from an instance of OrbitSolution.\n\n\n\n\n\nradvel(elem, t, M_planet)\n\nGet the radial velocity [m/s] of the primary along the line of sight at the time t [days]. The units of M_planet and elem.M must match.\n\nradvel(elem, t, M_planet)\n\nGet the radial velocity [m/s] of the primary along the line of sight from an OrbitSolution. The units of M_planet and elem.M must match.\n\n\n\n\n\n","category":"function"},{"location":"api/#DirectOrbits.acceleration","page":"API","title":"DirectOrbits.acceleration","text":"acceleration(elem, t)\n\nGet the instantaneous acceleration [mas/year^2] of the secondary at the time t [days].\n\nacceleration(o)\n\nGet the instantaneous acceleration [mas/year^2] of the secondary from an instance of OrbitSolution.\n\n\n\n\n\nacceleration(elem, t, M_planet)\n\nGet the instantaneous acceleration [mas/year^2] of  the primary in at the time t [days]. The units of M_planet and elem.M must match.\n\nacceleration(o)\n\nGet the instantaneous acceleration [mas/year^2] of the primary from an instance of OrbitSolution. The units of M_planet and elem.M must match.\n\n\n\n\n\n","category":"function"},{"location":"conventions/#Units-and-Conventions","page":"Conventions","title":"Units & Conventions","text":"","category":"section"},{"location":"conventions/","page":"Conventions","title":"Conventions","text":"The main constructor, KeplerianElements, accepts the following parameters:","category":"page"},{"location":"conventions/","page":"Conventions","title":"Conventions","text":"a: Semi-major axis in astronomical units (AU)\ni: Inclination in radians\ne: Eccentricity in the range [0, 1)\nτ: Epoch of periastron passage, in fraction of orbit [0,1]\nM: Graviataion parameter of the central body, expressed in units of Solar mass.\nω: Argument of periastron\nΩ: Longitude of the ascending node, radians.\nplx: Distance to the system expressed in milliarcseconds of parallax.","category":"page"},{"location":"conventions/","page":"Conventions","title":"Conventions","text":"Thee parameter τ represents the epoch of periastron passage as a  fraction of the planet's orbit between 0 and 1. This follows the same convention as Orbitize! and you can read more about their choice in ther FAQ.","category":"page"},{"location":"conventions/","page":"Conventions","title":"Conventions","text":"Parameters can either be specified by position or as keyword arguments (but not a mix).","category":"page"},{"location":"conventions/","page":"Conventions","title":"Conventions","text":"See this PDF for a detailed derivation of projected position, velocity, and acceleration from these coordinates: Derivation.pdf","category":"page"},{"location":"conventions/","page":"Conventions","title":"Conventions","text":"There is also a convenience constructor KeplerianElementsDeg that accepts i, ω, and Ω in units of degrees instead of radians.","category":"page"},{"location":"conventions/","page":"Conventions","title":"Conventions","text":"<img src=\"https://docs.exoplanet.codes/en/latest/_images/orbit3D.png\" style=\"width:300px\"/>","category":"page"},{"location":"conventions/","page":"Conventions","title":"Conventions","text":"Orbit Convenctions Schematic. Credit: exoplanet.py.","category":"page"},{"location":"conventions/","page":"Conventions","title":"Conventions","text":"This diagram from exoplanet.py is a good reference for the conventions used by this package with one exception: we flip the z-coordinate such that radial velocity is positive increasing away from the Earth. This does mean that the z-coordinate does not follow the right-hand rule as one might expect.","category":"page"},{"location":"getting-started/#Getting-Started","page":"Getting Started","title":"Getting Started","text":"","category":"section"},{"location":"getting-started/","page":"Getting Started","title":"Getting Started","text":"The first step to using DirectDetections.jl is to install Julia. If you're used to Python, don't worry –- Julia is easy to install, and you won't need to code anything other than changing your input data.","category":"page"},{"location":"getting-started/#Installing-Julia","page":"Getting Started","title":"Installing Julia","text":"","category":"section"},{"location":"getting-started/","page":"Getting Started","title":"Getting Started","text":"Visit the julialang.org Downloads page, and select the latest stable version for your operating system. Currently, this is 1.7.0. Click the [help] links next to your operating system if you require more detailed instructions.","category":"page"},{"location":"getting-started/#Installing-DirectOrbits","page":"Getting Started","title":"Installing DirectOrbits","text":"","category":"section"},{"location":"getting-started/","page":"Getting Started","title":"Getting Started","text":"Normally, Julia packages are installed from the General registry. Since DirectOrbits isn't quite ready for prime time, it requires one extra step to add an additional registry.","category":"page"},{"location":"getting-started/","page":"Getting Started","title":"Getting Started","text":"Start julia in a terminal by running julia\nType ] to enter package-mode (see Julia documentation for more details)\nType up to setup the General registry if this is your first time using Julia.\nType registry add https://github.com/sefffal/DirectRegistry\nType add DirectOrbits","category":"page"},{"location":"getting-started/","page":"Getting Started","title":"Getting Started","text":"If you would like to visualize your results, you can also install the Plots package:","category":"page"},{"location":"getting-started/","page":"Getting Started","title":"Getting Started","text":"Type add Plots","category":"page"},{"location":"getting-started/","page":"Getting Started","title":"Getting Started","text":"This will take a little while to download all the required packages and precompile for your system.","category":"page"},{"location":"getting-started/#Plotting-your-first-orbit","page":"Getting Started","title":"Plotting your first orbit","text":"","category":"section"},{"location":"plots/#Plotting","page":"Plotting","title":"Plotting","text":"","category":"section"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"This package defines a Plots.jl recipe for KeplerianElements.","category":"page"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"Example:","category":"page"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"elems = KeplerianElementsDeg(\n    a = 1.0,\n    M = 1.0,\n    i = 0,\n    e = 0,\n    ω = 0,\n    Ω = 0,\n    plx = 1000,\n    τ = 0,\n)\n\nplot(elems)","category":"page"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"(Image: orbit)","category":"page"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"The orbit described by the elements is traced out automatically in equal steps of true anomaly (ν) which gives a smooth curve regardless of eccentricity.","category":"page"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"The plot recipe sets the axes to have default aspect ratios and flips the right-ascension (horizontal) axis to increasing towards the left as it does when viewed in the plane of the sky.","category":"page"},{"location":"plots/#Plotting-multiple-orbits","page":"Plotting","title":"Plotting multiple orbits","text":"","category":"section"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"If you have an array of Keplerian orbits, you can plot them all in one go:","category":"page"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"elements = [KeplerianElementsDeg(a=16+0.3i, i=i, e=0.25+0.001i, τ=0, M=1, ω=0, Ω=120, plx=35) for i in 1:1:90]\nplot(elements)","category":"page"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"This recipe scales down the opacity slightly so that you can see where the orbits overlap. Override by passing alpha=1.","category":"page"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"(Image: orbit)","category":"page"},{"location":"plots/#Logo","page":"Plotting","title":"Logo","text":"","category":"section"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"To get more ideas for plotting, check out this example which generates an animated version of the logo for this page.","category":"page"},{"location":"plots/","page":"Plotting","title":"Plotting","text":"(Image: orbit logo)","category":"page"},{"location":"#DirectOrbits.jl","page":"Home","title":"DirectOrbits.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"GitHub","category":"page"},{"location":"","page":"Home","title":"Home","text":"Tools for solving Keplerian orbits in the context of direct imaging. The primary use case is mapping Keplerian orbital elements into Cartesian coordinates at different times. A Plots.jl recipe is included for easily plotting orbits.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Among other values, it calculates the projected positions of planets, as well as stellar radial velocity and proper motion anomaly. It's a great tool for visualizing different orbits (see examples) and generating nice animations (e.g. with Plots or Luxor.jl).","category":"page"},{"location":"","page":"Home","title":"Home","text":"This package has been designed for good performance and composability with a wide range of packages in the Julia ecosystem, including ForwardDiff. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"To fit orbits to observations, see DirectDetections.jl.","category":"page"},{"location":"","page":"Home","title":"Home","text":"See also DirectImages.jl.","category":"page"},{"location":"","page":"Home","title":"Home","text":"(Image: Orbit Plot)","category":"page"},{"location":"#Tutorials","page":"Home","title":"Tutorials","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\"plots.md\", \"image-warping.md\"]\nDepth = 5","category":"page"},{"location":"#Documentation","page":"Home","title":"Documentation","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Pages = [\"api.md\", \"conventions.md\", \"kepler.md\"]\nDepth = 5","category":"page"},{"location":"image-warping/#Image-Warping","page":"Image Warping","title":"Image Warping","text":"","category":"section"},{"location":"image-warping/","page":"Image Warping","title":"Image Warping","text":"If you have an image of a system, you can warp the image as if each pixel were a test particle following Kepler's laws.  This is an easy way to see what a disk or a system of planets would look like at a time other than when it was captured.","category":"page"},{"location":"image-warping/","page":"Image Warping","title":"Image Warping","text":"To make this possible, DirectOrbits.jl can create OrbitalTransformation objects. These follow the conventions set out in CoordinateTransformations.jl and are compatible with ImageTransformations.jl.","category":"page"},{"location":"image-warping/","page":"Image Warping","title":"Image Warping","text":"Example:","category":"page"},{"location":"image-warping/","page":"Image Warping","title":"Image Warping","text":"ot = OrbitalTransformation(\n    i = 0.3,\n    e = 0.1,\n    M = 1.0,\n    ω = 0.5,\n    Ω = 0.5,\n    plx = 30.0,\n    \n    platescale=10.0, # mas/px\n    dt = 3*365.25 # days forward in time\n)\n\nimg_centered = centered(img)\nimg_future = warp(img_centered, ot, axes(i))\n\n# Display with DirectImages.jl\nusing DirectImages\nimshow2([img; img_future], clims=(0,1), cmap=:seaborn_icefire_gradient)","category":"page"},{"location":"image-warping/","page":"Image Warping","title":"Image Warping","text":"Before, and After Orbital Transformation","category":"page"},{"location":"image-warping/","page":"Image Warping","title":"Image Warping","text":"(Image: image)","category":"page"},{"location":"image-warping/","page":"Image Warping","title":"Image Warping","text":"Note the arguments platescale and dt are required, but a and τ are not. The position of the pixel in X/Y space uniquely determines the semi-major axis and epoch of periastron passage when the rest of the orbital parameters are known. platescale in units of milliarseconds/pixel is necessary to get the overall scale of the transform correct. This is because an orbital transformation is not linear (and therefore, care must be taken when composing an OrbitalTransformation with other CoordinateTransformations). Scaling an image will change the amount of rotation that occurs at each separation. dt is the the amount of time in days to project the image forward. It can also be negative to project the image into the past. ","category":"page"},{"location":"kepler/#Kepler-Solver","page":"Kepler Solver","title":"Kepler Solver","text":"","category":"section"},{"location":"kepler/","page":"Kepler Solver","title":"Kepler Solver","text":"The heart of this package is being able to take a set of Keplerian elements and output relative positions, velocities, etc. The Kepler solver used to go from mean anomaly to eccentric anomaly is a tweaked version copied from AstroLib.jl.","category":"page"},{"location":"kepler/","page":"Kepler Solver","title":"Kepler Solver","text":"From AstroLib.jl:","category":"page"},{"location":"kepler/","page":"Kepler Solver","title":"Kepler Solver","text":"Many different numerical methods exist to solve Kepler's equation. This function implements the algorithm proposed in Markley (1995) Celestial Mechanics and Dynamical Astronomy, 63, 101 (DOI:10.1007/BF00691917). This method is not iterative, requires only four transcendental function evaluations, and has been proved to be fast and efficient over the entire range of elliptic motion 0≤e≤10.","category":"page"},{"location":"kepler/","page":"Kepler Solver","title":"Kepler Solver","text":"On my laptop, this solves for a single eccentric anomaly in just 47 ns. Since it is implemented in pure Julia, there is no overhead from calling into a C or Cython compiled function and no need for vectorization.","category":"page"}]
}
