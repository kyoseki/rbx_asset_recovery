local decals = {
    201086438,
    202282177,
    7198793762,
    8115996195,
    8116465872,
    8116416310,
    7202202205,
    6549971491,
    6975605142,
    8115955435,

    -- "not approved"
    6239835998,
    8795479844,
    7198800836,
    8383276881,
    8585168320
}

for _, v in pairs(decals) do
    local part = Instance.new("Part");
    local decal = Instance.new("Decal");
    decal.Texture = "rbxassetid://"..v
    decal.Parent = part
    part.Parent = workspace
    wait(1)
end