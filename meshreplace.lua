local listener

game:GetService("Selection").SelectionChanged:Connect(function()
    if listener then
        listener:Disconnect()
    end

    local selection = game:GetService("Selection"):Get()
    if #selection == 0 then
        return
    end

    local item = selection[1];
    if item:IsA("MeshPart") then
        local size = item.Size;

        listener = item:GetPropertyChangedSignal("MeshId"):Connect(function()
            item.Size = size
        end)
    end
end)