--[[
    Save this as a local plugin in Roblox Studio,
    then use the toolbar to replace every mesh in the game.

    Keep a backup!!!
]]

local meshes = {
    ["6544056189"] = "rbxassetid://10206637084",
    ["6544050056"] = "rbxassetid://10206652829",
    ["6544067160"] = "rbxassetid://10206659749",
    ["6544080206"] = "rbxassetid://10206666242",
    ["6543956948"] = "rbxassetid://10206509805",
    ["6543898501"] = "rbxassetid://10206588686",
    ["6543840926"] = "rbxassetid://10206603578",
    ["6543855128"] = "rbxassetid://10206616323",
    ["6544000498"] = "rbxassetid://10206565711",
    ["7616537282"] = "rbxassetid://10206859952",
    ["7616541936"] = "rbxassetid://10206867887",
    ["7616468916"] = "rbxassetid://10206920839",
    ["7616688873"] = "rbxassetid://10206907251",
    ["7616774578"] = "rbxassetid://10206964399",
    ["7616655877"] = "rbxassetid://10206954494",
    ["7616646277"] = "rbxassetid://10206901512",
    ["7616661119"] = "rbxassetid://10206960095",
    ["7616805740"] = "rbxassetid://10206912723",
    ["6786721564"] = "rbxassetid://10207027139",
    ["6768581399"] = "rbxassetid://10207067683",
    ["6786932020"] = "rbxassetid://10207078656",
    ["6786860587"] = "rbxassetid://10207073516",
    ["6786582042"] = "rbxassetid://10207040566",
    ["6786586880"] = "rbxassetid://10207045187",
    ["6786963076"] = "rbxassetid://10207060059",
    ["6786960329"] = "rbxassetid://10207053004",
    ["7639731999"] = "rbxassetid://10207176320",
    ["7639750320"] = "rbxassetid://10207180591",
    ["7639836577"] = "rbxassetid://10207186548",
    ["7639851329"] = "rbxassetid://10207206281",
    ["7639868230"] = "rbxassetid://10207211167",
    ["7639885435"] = "rbxassetid://10207260864",
    ["7639427097"] = "rbxassetid://10207269487",
    ["7639429746"] = "rbxassetid://10207277347",
    ["7639467743"] = "rbxassetid://10207284188",
    ["7639468627"] = "rbxassetid://10207280577",
    ["7639469498"] = "rbxassetid://10207313447",
    ["7639470664"] = "rbxassetid://10207325486",
    ["7639471680"] = "rbxassetid://10207327991",
    ["7639466654"] = "rbxassetid://10207334232",
    ["7639804858"] = "rbxassetid://10207147357",
    ["7538647051"] = "rbxassetid://10207677188",
    ["7538628968"] = "rbxassetid://10207679867",
    ["7538640529"] = "rbxassetid://10207684366",
    ["7538544505"] = "rbxassetid://10207661067",
    ["7538543664"] = "rbxassetid://10207658675",
    ["7538665737"] = "rbxassetid://10207671494",
    ["7538666429"] = "rbxassetid://10207669548",
    ["7538582234"] = "rbxassetid://10207665589",
    ["7538577310"] = "rbxassetid://10207664298",
    ["7538597527"] = "rbxassetid://10207652878",
    ["6473918080"] = "rbxassetid://10208035909",
    ["6473901983"] = "rbxassetid://10208035909",
    ["6473861911"] = "rbxassetid://10208161819",
    ["6474226006"] = "rbxassetid://10208165409",
    ["6473854627"] = "rbxassetid://10208159605",
    ["6473944816"] = "rbxassetid://10208015469",
    ["6473948751"] = "rbxassetid://10208009282",
    ["6473701147"] = "rbxassetid://10208018169",
    ["7022532674"] = "rbxassetid://10208096758",
    ["6294782322"] = "rbxassetid://10209082172",
    ["6266460432"] = "rbxassetid://10209118952",
    ["7022474087"] = "rbxassetid://10209153414",
    ["7022494091"] = "rbxassetid://10209147646",
    ["7022505712"] = "rbxassetid://10209150452",
    ["7022513444"] = "rbxassetid://10209158272",
    ["7022646940"] = "rbxassetid://10209141623",
    ["7022649987"] = "rbxassetid://10209138104",
    ["6689754487"] = "rbxassetid://10209203795",
    ["6689733499"] = "rbxassetid://10209207968",
    ["6689745174"] = "rbxassetid://10209213676",
    ["6689709677"] = "rbxassetid://10209200161",
    ["6690007105"] = "rbxassetid://10209231887",
    ["6690107378"] = "rbxassetid://10209402783",
    ["6690132306"] = "rbxassetid://10209376266",
    ["6690152688"] = "rbxassetid://10209372720",
    ["6690139558"] = "rbxassetid://10209364399",
    ["6690162007"] = "rbxassetid://10209235186",
    ["6689565075"] = "rbxassetid://10209195028",
    ["6689579253"] = "rbxassetid://10209192316",
    ["6689630905"] = "rbxassetid://10209186843",
    ["7198367308"] = "rbxassetid://10209461496",
    ["7198352969"] = "rbxassetid://10209458692",
    ["6257235273"] = "rbxassetid://9398218487",
    ["6257349565"] = "rbxassetid://9398218453",
    ["6257350586"] = "rbxassetid://9398218509",
    ["6263711994"] = "rbxassetid://9398218498",
    ["6257105377"] = "rbxassetid://9398218607",
    ["6263109876"] = "rbxassetid://9398218427",
    ["6257326183"] = "rbxassetid://9398218436",
    ["6257269733"] = "rbxassetid://9398218438",
    ["6257519016"] = "rbxassetid://9398218589",
    ["6975644108"] = "rbxassetid://10215325393",
    ["6975665000"] = "rbxassetid://10215329282",
    ["6975664201"] = "rbxassetid://10215331685",
    ["6975704955"] = "rbxassetid://10215335310",
    ["6975671319"] = "rbxassetid://10215341670",
    ["6975683751"] = "rbxassetid://10215275100",
    ["8116788520"] = "rbxassetid://10215477158",
    ["8116858163"] = "rbxassetid://10215472695",
    ["8116836995"] = "rbxassetid://10215466797",
    ["8116806890"] = "rbxassetid://10215482851",
    ["8116982960"] = "rbxassetid://10215270699",
    ["8116981443"] = "rbxassetid://10215271031",
    ["8116985908"] = "rbxassetid://10215271426",
    ["8116870420"] = "rbxassetid://10215272165",
    ["8678641892"] = "rbxassetid://10215541932",
    ["8678749041"] = "rbxassetid://10215545194",
    ["8678787607"] = "rbxassetid://10215553377",
    ["8678706973"] = "rbxassetid://10215526586",
    ["8678682981"] = "rbxassetid://10215529537",
    ["8678684012"] = "rbxassetid://10215532555",
    ["7026004907"] = "rbxassetid://10215660473",
    ["7026008823"] = "rbxassetid://10215657948",
    ["6473891932"] = "rbxassetid://10215269474",
    ["7026097620"] = "rbxassetid://10215290732",
    ["7026041272"] = "rbxassetid://10215291141",
    ["7026032044"] = "rbxassetid://10215291522",
    ["7026111862"] = "rbxassetid://10215292048",
    ["7026110554"] = "rbxassetid://10215292473",
    ["6270612838"] = "rbxassetid://10215266575",
    ["6271088115"] = "rbxassetid://10215267001",
    ["6274500767"] = "rbxassetid://10215267381",
    ["6271478266"] = "rbxassetid://10215267834",
    ["6274476515"] = "rbxassetid://10215268303",
    ["6270595186"] = "rbxassetid://10215268706",
    ["6270961362"] = "rbxassetid://10215269055",
    ["6268961444"] = "rbxassetid://10215270222",
    ["8117413092"] = "rbxassetid://10215272619",
    ["6550393507"] = "rbxassetid://10215272990",
    ["6786135223"] = "rbxassetid://10215273432",
    ["6786136822"] = "rbxassetid://10215274765",
    ["6323243162"] = "rbxassetid://10215275876",
    ["7050937452"] = "rbxassetid://10215276336",
    ["7202322854"] = "rbxassetid://10215277097",
    ["8117663686"] = "rbxassetid://10215277763",
    ["8117678640"] = "rbxassetid://10215278158",
    ["8117649608"] = "rbxassetid://10215278818",
    ["6967682732"] = "rbxassetid://10215279353",
    ["6967622540"] = "rbxassetid://10215280040",
    ["6967667772"] = "rbxassetid://10215280705",
    ["6967640580"] = "rbxassetid://10215281289",
    ["7051659945"] = "rbxassetid://10215281826",
    ["7051519067"] = "rbxassetid://10215282450",
    ["7051491934"] = "rbxassetid://10215282916",
    ["7051672042"] = "rbxassetid://10215283464",
    ["7051344842"] = "rbxassetid://10215283844",
    ["7051330082"] = "rbxassetid://10215284276",
    ["7051329625"] = "rbxassetid://10215284790",
    ["7050210428"] = "rbxassetid://10215285458",
    ["7050127655"] = "rbxassetid://10215285838",
    ["7050164445"] = "rbxassetid://10215286231",
    ["7050054719"] = "rbxassetid://10215286860",
    ["7050143551"] = "rbxassetid://10215287429",
    ["7050171476"] = "rbxassetid://10215287939",
    ["7050015752"] = "rbxassetid://10215288491",
    ["7049986137"] = "rbxassetid://10215288964",
    ["7050009250"] = "rbxassetid://10215289311",
    ["7049981974"] = "rbxassetid://10215289708",
    ["7050955572"] = "rbxassetid://10215290246",
    ["7051065992"] = "rbxassetid://10215292919",
    ["7051080502"] = "rbxassetid://10215293317",
    ["7051065366"] = "rbxassetid://10215293842",
    ["7050930022"] = "rbxassetid://10215294154",
    ["7050831472"] = "rbxassetid://10215294893",
    ["7050928434"] = "rbxassetid://10215295220",
    ["7032850487"] = "rbxassetid://10215295754",
    ["7657995376"] = "rbxassetid://10215296343",
    ["7657987016"] = "rbxassetid://10215296844",
    ["8917314551"] = "rbxassetid://10215297142",
    ["8917313803"] = "rbxassetid://10215297570",
    ["8917338413"] = "rbxassetid://10215297909",
    ["8917201394"] = "rbxassetid://10215298297",
    ["8917234846"] = "rbxassetid://10215298792",
    ["8917364361"] = "rbxassetid://10215299079",
    ["7658004983"] = "rbxassetid://10215299446",
    ["7657977535"] = "rbxassetid://10215299895"
}

local decals = {
    ["8116465872"] = "rbxassetid://10215376461",
    ["6975605142"] = "rbxassetid://10215367675",
    ["8116416310"] = "rbxassetid://10215637518",
    ["6549971491"] = "rbxassetid://10226860184",
    ["7353845281"] = "rbxassetid://7953298370",
    ["6592437827"] = "rbxassetid://7953298234",
    ["8115996195"] = "rbxassetid://10238054664",
    ["8115955435"] = "rbxassetid://10238074366",
    ["7198793762"] = "rbxassetid://10237802283",
    ["7202202205"] = "rbxassetid://10237822458"
};

local textures = {
    ["6549748841"] = "rbxassetid://10226926105"
}

local toolbar = plugin:CreateToolbar("SBF Mesh Recovery")
local button = toolbar:CreateButton("Replace Known Meshes", "Replace Known Meshes", "rbxassetid://4458901886")

local function findReplacement(id, t)
    for k, v in pairs(t) do
        if id:sub(-k:len()) == k then
            print(id, "=>", v)
            return v
        end
    end
end

local meshPartProperties = {
    "DoubleSided",
    "TextureID",
    "Anchored",
    "Size",
    "CFrame",
    "AssemblyLinearVelocity",
    "AssemblyAngularVelocity",
    "BackSurface",
    "BottomSurface",
    "Color",
    "CanCollide",
    "CanQuery",
    "CanTouch",
    "CastShadow",
    "CollisionGroupId",
    "CustomPhysicalProperties",
    "FrontSurface",
    "LeftSurface",
    "Locked",
    "Massless",
    "Material",
    "PivotOffset",
    "Reflectance",
    "RightSurface",
    "RootPriority",
    "TopSurface",
    "Transparency",
    "Name"
};

button.Click:Connect(function()
    for _, instance in pairs(game:GetDescendants()) do
        -- fix brokenness (example)
        --[[
        if instance:IsA("Humanoid") then
            for _, v in pairs(instance.Parent:GetDescendants()) do
                if v:IsA("MeshPart") and v.AssemblyRootPart == v and not v.Anchored and instance.Parent.PrimaryPart ~= v then
                    for _, id in pairs(meshes) do
                        if id == v.MeshId then
                            print("Removing duplicate part from", instance.Parent, "-", v)
                            v:Destroy()
                            break
                        end
                    end
                end
            end
        end
        ]]

        if instance:IsA("MeshPart") then
            local replacement = findReplacement(instance.MeshId, meshes)

            if replacement then
                local replacementPart

                local success = pcall(function()
                    replacementPart = game:GetService("InsertService"):CreateMeshPartAsync(
                        replacement,
                        instance.CollisionFidelity,
                        instance.RenderFidelity
                    )
                end)

                if not success then
                    warn("ID", instance.MeshId, "(part "..instance.Name..") failed to replace")
                    continue
                end

                for _, v in pairs(meshPartProperties) do
                    replacementPart[v] = instance[v]
                end

                instance:ApplyMesh(replacementPart)
            end

            local replacementTex = findReplacement(instance.TextureID, textures)

            if replacementTex then
                instance.TextureID = replacementTex
            end
        elseif instance:IsA("SpecialMesh") then
            local replacement = findReplacement(instance.MeshId, meshes)

            if replacement then
                instance.MeshId = replacement
            end

            local replacementTex = findReplacement(instance.TextureId, textures)

            if replacementTex then
                instance.TextureId = replacementTex
            end
        elseif instance:IsA("Decal") then
            local replacement = findReplacement(instance.Texture, decals)

            if replacement then
                instance.Texture = replacement
            end
        end
    end
end)