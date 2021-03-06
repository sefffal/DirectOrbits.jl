using Test

using DirectOrbits


# 10 steps per day for one year
one_year_range = 0.0:0.1:365.24

# Relative tolerance for certain tests
rtol=1e-6
# Absolute tolerance for certain tests
atol=1e-6

# Begin with basic consistency tests
@testset "Circular" begin
    
    # Create an idealized orbit like the Earth's at 1pc distance.
    circular_face_on_1AU_1Msun_1pc = KeplerianElements(
        a = 1.0, # AU
        i = 0.0,
        e = 0.0,
        τ = 0.0,
        μ = 1.0, # M_sun
        ω = 0.0,
        Ω = 0.0,
        plx = 1000.0, # 1000 mas == 1pc
    )

    # Period of the orbit is 1 year by definition
    @test period(circular_face_on_1AU_1Msun_1pc) == 1.0*DirectOrbits.year2days

    # 1000mas==1as of paralax means 1pc, by definition
    @test distance(circular_face_on_1AU_1Msun_1pc) == 1

    # Mean motion is one revolution per year
    @test DirectOrbits.meanmotion(circular_face_on_1AU_1Msun_1pc) == 2π
    
    # Face on orbits should have no z position ever
    @test all(
        ==(0),
        losoff.(circular_face_on_1AU_1Msun_1pc, one_year_range)
    )
    # But their x & y positions should add to 1AU separation
    x = raoff.(circular_face_on_1AU_1Msun_1pc, one_year_range)
    y = decoff.(circular_face_on_1AU_1Msun_1pc, one_year_range)
    sep = sqrt.(x.^2 .+ y.^2)
    @test all(≈(1000.0), sep)
    
    # We should return to our initial position after exactly one period
    @test kep2cart(circular_face_on_1AU_1Msun_1pc, period(circular_face_on_1AU_1Msun_1pc)) ≈ kep2cart(circular_face_on_1AU_1Msun_1pc, 0.0)

    # We should be halfway around the orbit after half a period (in this case)
    @test -kep2cart(circular_face_on_1AU_1Msun_1pc, period(circular_face_on_1AU_1Msun_1pc)/2) ≈ kep2cart(circular_face_on_1AU_1Msun_1pc, 0.0)

end

@testset "Inclination" begin
    # Now add some inclination
    circular_inclined_1AU_1Msun_1pc = KeplerianElements(
        a = 1.0, # AU
        i = deg2rad(90.0),
        e = 0.0,
        τ = 0.0,
        μ = 1.0, # M_sun
        ω = 0.0,
        Ω = 0.0,
        plx = 1000.0, # 1000 mas == 1pc
    )
    # Face on orbits should now have z positions
    @test any(
        !=(0),
        getindex.(kep2cart.(circular_inclined_1AU_1Msun_1pc, one_year_range),3)
    )
    @test period(circular_inclined_1AU_1Msun_1pc) == 1.0*DirectOrbits.year2days
    @test distance(circular_inclined_1AU_1Msun_1pc) == 1
    @test DirectOrbits.meanmotion(circular_inclined_1AU_1Msun_1pc) == 2π
    @test -kep2cart(circular_inclined_1AU_1Msun_1pc, period(circular_inclined_1AU_1Msun_1pc)/2) ≈ kep2cart(circular_inclined_1AU_1Msun_1pc, 0.0)

    @test all(≈(1000.0), projectedseparation.(circular_inclined_1AU_1Msun_1pc, one_year_range))

    ys = decoff.(circular_inclined_1AU_1Msun_1pc, one_year_range)
    @test maximum(ys) ≈ 1000 rtol=rtol
    @test minimum(ys) ≈ -1000 rtol=rtol

    xs = raoff.(circular_inclined_1AU_1Msun_1pc, one_year_range)
    @test all(≈(0.0, atol=atol), xs)

    zs = losoff.(circular_inclined_1AU_1Msun_1pc, one_year_range)
    @test maximum(zs) ≈ 1000 rtol=rtol
    @test minimum(zs) ≈ -1000 rtol=rtol


    # Now adjust Ω
    inclined_rot_90deg = KeplerianElements(
        a = 1.0, # AU
        i = deg2rad(90.0),
        e = 0.0,
        τ = 0.0,
        μ = 1.0, # M_sun
        ω = 0.0,
        Ω = deg2rad(90.0),
        plx = 1000.0, # 1000 mas == 1pc
    )
    
    xs = raoff.(inclined_rot_90deg, one_year_range)
    ys = decoff.(inclined_rot_90deg, one_year_range)
    zs = losoff.(inclined_rot_90deg, one_year_range)
    @test all(≈(0.0, atol=atol), ys)
    @test maximum(xs) ≈ 1000 rtol=rtol
    @test minimum(xs) ≈ -1000 rtol=rtol
    @test maximum(zs) ≈ 1000 rtol=rtol
    @test minimum(zs) ≈ -1000 rtol=rtol

    # Intermediate inclination
    inclined_45deg_1AU_1Msun_1pc = KeplerianElements(
        a = 1.0, # AU
        i = deg2rad(45.0),
        e = 0.0,
        τ = 0.0,
        μ = 1.0, # M_sun
        ω = 0.0,
        Ω = 0.0,
        plx = 1000.0, # 1000 mas == 1pc
    )
    @test all(≈(1000.0), projectedseparation.(inclined_45deg_1AU_1Msun_1pc, one_year_range))
    
    ys = decoff.(inclined_45deg_1AU_1Msun_1pc, one_year_range)
    @test maximum(ys) ≈ 1000 rtol=rtol
    @test minimum(ys) ≈ -1000 rtol=rtol

    xs = raoff.(inclined_45deg_1AU_1Msun_1pc, one_year_range)
    @test maximum(xs) ≈ 1000*√2/2 rtol=rtol
    @test minimum(xs) ≈ -1000*√2/2 rtol=rtol

    zs = losoff.(inclined_45deg_1AU_1Msun_1pc, one_year_range)
    @test maximum(zs) ≈ 1000*√2/2 rtol=rtol
    @test minimum(zs) ≈ -1000*√2/2 rtol=rtol

end



@testset "Eccentricity" begin
    # Basic eccentric orbit
    eccentric_1AU_1Msun_1pc = KeplerianElements(
        a = 1.0, # AU
        i = 0.0,
        e = 0.5,
        τ = 0.0,
        μ = 1.0, # M_sun
        ω = 0.0,
        Ω = 0.0,
        plx = 1000.0, # 1000 mas == 1pc
    )
    xs = raoff.(eccentric_1AU_1Msun_1pc, one_year_range)
    ys = decoff.(eccentric_1AU_1Msun_1pc, one_year_range)
    zs = losoff.(eccentric_1AU_1Msun_1pc, one_year_range)
    ps = projectedseparation.(eccentric_1AU_1Msun_1pc, one_year_range)

    @test period(eccentric_1AU_1Msun_1pc) == 1.0*DirectOrbits.year2days
    @test distance(eccentric_1AU_1Msun_1pc) == 1
    
    # Mean motion should be the same
    @test DirectOrbits.meanmotion(eccentric_1AU_1Msun_1pc) == 2π

    # The separation should now be varying
    # By definition of eccentricity 0.5, 1AU and 1PC
    @test maximum(ps) ≈ 1500 rtol=rtol
    @test minimum(ps) ≈ 500 rtol=rtol

    # When argument of periapsis and periastron are both zero, periastron should be in the East, apoastron in the West
    @test maximum(ys) ≈ 500 rtol=rtol
    @test minimum(ys) ≈ -1500 rtol=rtol


    # Rotate Ω
    ecc_rot_Ω = KeplerianElements(
        a = 1.0, # AU
        i = 0.0,
        e = 0.5,
        τ = 90.0,
        μ = 1.0, # M_sun
        ω = 0.0,
        Ω = deg2rad(90),
        plx = 1000.0, # 1000 mas == 1pc
    )
    xs = raoff.(ecc_rot_Ω, one_year_range)
    ys = decoff.(ecc_rot_Ω, one_year_range)
    zs = losoff.(ecc_rot_Ω, one_year_range)
    # Recall, East is left in the sky.
    # We have rotated  90 degrees CCW.
    @test minimum(xs) ≈ -1500 rtol=rtol
    @test maximum(xs) ≈ 500 rtol=rtol

    # Rotate τ
    ecc_rot_ω = KeplerianElements(
        a = 1.0, # AU
        i = 0.0,
        e = 0.5,
        τ = 0.0,
        μ = 1.0, # M_sun
        ω = deg2rad(90.0),
        Ω = 0.0,
        plx = 1000.0, # 1000 mas == 1pc
    )
    xs = raoff.(ecc_rot_ω, one_year_range)
    ys = decoff.(ecc_rot_ω, one_year_range)
    zs = losoff.(ecc_rot_ω, one_year_range)
    # Recall, East is left in the sky.
    # We have rotated  90 degrees CCW.
    @test minimum(xs) ≈ -1500 rtol=rtol
    @test maximum(xs) ≈ 500 rtol=rtol

    # Rotate Ω & τ
    ecc_rot_Ωτ = KeplerianElements(
        a = 1.0, # AU
        i = 0.0,
        e = 0.5,
        τ = 90.0,
        μ = 1.0, # M_sun
        ω = deg2rad(-90),
        Ω = deg2rad(90),
        plx = 1000.0, # 1000 mas == 1pc
    )
    xs = raoff.(ecc_rot_Ωτ, one_year_range)
    ys = decoff.(ecc_rot_Ωτ, one_year_range)
    zs = losoff.(ecc_rot_Ωτ, one_year_range)
    # Recall, East is left in the sky.
    # We have rotated  90 degrees CCW.
    @test maximum(ys) ≈ 500 rtol=rtol
    @test minimum(ys) ≈ -1500 rtol=rtol

    
    # Highly eccentric 
    ecc09 = KeplerianElements(
        a = 1.0, # AU
        i = 0.0,
        e = 0.9,
        τ = 0.0,
        μ = 1.0, # M_sun
        ω = 0.0,
        Ω = 0.0,
        plx = 1000.0, # 1000 mas == 1pc
    )
    xs = raoff.(ecc09, one_year_range)
    ys = decoff.(ecc09, one_year_range)
    zs = losoff.(ecc09, one_year_range)
    ps = projectedseparation.(ecc09, one_year_range)
    # Loosen the tolerance on these
    @test maximum(ps) ≈ 1900 rtol=1e-4
    @test minimum(ps) ≈ 100 rtol=1e-4

    # Extremely eccentric 
    ecc09 = KeplerianElements(
        a = 1.0, # AU
        i = 0.0,
        e = 1-1e-3,
        τ = 0.0,
        μ = 1.0, # M_sun
        ω = 0.0,
        Ω = 0.0,
        plx = 1000.0, # 1000 mas == 1pc
    )
    xs = raoff.(ecc09, one_year_range)
    ys = decoff.(ecc09, one_year_range)
    zs = losoff.(ecc09, one_year_range)
    ps = projectedseparation.(ecc09, one_year_range)
    @test maximum(ps) ≈ 1999 rtol=1e-4
    # Loosen the tolerance on these even more (periastron flies by very quickly)
    @test minimum(ps) ≈ 1 rtol=1e1

    
end;  


@testset "Motion" begin
    circ = KeplerianElements(
        a = 1.0,
        i = 0.0,
        e = 0.0,
        τ = 0.0,
        μ = 1.0,
        ω = 0.0,
        Ω = 0.0,
        plx = 1000.0,
    )

    @test kep2cart(circ, 0.0, tref=0.)[1:3] ≈ [0., 1000.0, 0.0] rtol=rtol
    @test kep2cart(circ, period(circ)/4, tref=0.)[1:3] ≈ [1000., 0.0, 0.0] rtol=rtol
    @test kep2cart(circ, period(circ)/2, tref=0.)[1:3] ≈ [0.0, -1000.0, 0.0] rtol=rtol
    @test kep2cart(circ, period(circ)*3/4, tref=0.)[1:3] ≈ [-1000.0, 0.0, 0.0] rtol=rtol
    @test kep2cart(circ, period(circ), tref=0.)[1:3] ≈ [0., 1000.0, 0.0]  rtol=rtol

    ecc_rot_ω = KeplerianElements(
        a = 1.0, # AU
        i = 0.0,
        e = 0.5,
        τ = 0.0,
        μ = 1.0, # M_sun
        ω = deg2rad(90.0),
        Ω = 0.0,
        plx = 1000.0, # 1000 mas == 1pc
    )

    @test kep2cart(ecc_rot_ω, 0.0, tref=0.)[1:3] ≈ [500.0, 0.0, 0.0] rtol=rtol
    @test kep2cart(ecc_rot_ω, period(ecc_rot_ω)/2, tref=0.)[1:3] ≈ [-1500., 0.0, 0.0] rtol=rtol


    circt2 = KeplerianElements(
        a = 1.0,
        i = 0.0,
        e = 0.0,
        τ = 0.5,
        μ = 1.0,
        ω = 0.0,
        Ω = 0.0,
        plx = 1000.0,
    )

    @test kep2cart(circt2, 0.0, tref=0.)[1:3] ≈ [0., -1000.0, 0.0] rtol=rtol
    @test kep2cart(circt2, period(circt2)/4, tref=0.)[1:3] ≈ [-1000., 0.0, 0.0] rtol=rtol
    @test kep2cart(circt2, period(circt2)/2, tref=0.)[1:3] ≈ [0.0, 1000.0, 0.0] rtol=rtol
    @test kep2cart(circt2, period(circt2)*3/4, tref=0.)[1:3] ≈ [1000.0, 0.0, 0.0] rtol=rtol
    @test kep2cart(circt2, period(circt2), tref=0.)[1:3] ≈ [0., -1000.0, 0.0]  rtol=rtol
   
end


# Next step is integrating examples from the literature

# ##

# @testset "Transformations" begin
    
#     # Test that our orbital transformations code produces the same results as our forward direct code, tested above.

#     # for i in 0:0.1:2π
#     # for i=0.0, a=0.5:1.0:10, e=0.0, ω=0.00, Ω=0:1:2π, plx=1000.0, μ=1.0, τ=0.8, t₀=0:10:300
#     for i=0.0, a=1.0, e=0.0, ω=0.01, Ω=0.01, plx=1000.0, μ=1.0, τ=0.8, t₀=0.
#         el = KeplerianElements(;a, i, e, ω, Ω, plx, μ, τ)
#         pos1 = kep2cart(el, t₀)
#         # for dt in range(0, stop=period(el), length=4)
#         for dt=10.0
#             pos2 = kep2cart(el, t₀+dt)[1:2]
#             ot = OrbitalTransformation(;i, e, ω, Ω, plx, μ, platescale=1., dt=dt)
#             pos2′ = ot(pos1)
#             # @show pos2 pos2′
#             @test pos2′ ≈ pos2 rtol=1e-2
#         end
#     end
# end