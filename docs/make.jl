using Documenter, DirectOrbits


makedocs(
    sitename="DirectOrbits.jl",
    pages = [
        "Home" => "index.md",
        # "Getting Started" => "getting-started.md",
        "Tutorials" => [
            "Plotting" => "plots.md",
            "Image Warping" => "image-warping.md",
        ],
        "Documentation" => [
            "API" => "api.md",
            "Conventions" => "conventions.md",
            "Kepler Solver" => "kepler.md",
        ]
    ],
    format = Documenter.HTML(
        prettyurls = get(ENV, "CI", nothing) == "true"
    )
)


deploydocs(
    repo = "github.com/sefffal/DirectOrbits.jl.git",
    devbranch = "master"
)
