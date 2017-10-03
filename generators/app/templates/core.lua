<%- appName %> = LibStub('AceAddon-3.0'):NewAddon('<%- appName %>', 'AceConsole-3.0', 'AceEvent-3.0')
local addonName = <%- appName %>:GetName()
local L = LibStub('AceLocale-3.0'):GetLocale(addonName)
local Options, Util

--
-- ─── MINIMAP ICON ───────────────────────────────────────────────────────────────
--

local function OpenOptionsWindow()
    local Ace = LibStub('AceConfigDialog-3.0')
    Ace:Open(addonName)
end

<% if (iconPath) { %>
local LDB = LibStub('LibDataBroker-1.1'):NewDataObject(addonName, {
    type = 'launcher',
    icon = format('Interface\\AddOns\\%s\\<%- iconPath %>', addonName),
    OnClick = function(clickedframe, button)
            if button == 'LeftButton' then
                OpenOptionsWindow()
            end
    end,
    OnTooltipShow = function(Tip)
        if not Tip or not Tip.AddLine then
            return
        end

        Tip:AddLine(addonName, 1, 1, 1)
    end,
})
<% } %>

--
-- ─── INIT ───────────────────────────────────────────────────────────────────────
--

function <%- appName %>:OnInitialize()
end

function <%- appName %>:OnEnable()
    -- Get Modules
    Options = self:GetModule('Options')
    Util = self:GetModule('Util')

    <% if (chatCmd) { %>
    -- Slash Commands
    self:RegisterChatCommand('<%- chatCmd %>', 'ChatCommand')
    <% } %>

    <% if (iconPath) { %>
    -- Minimap Icon
    LibStub('LibDBIcon-1.0'):Register('<%- appName %>', LDB, Options:Get('minimapIcon'))
    <% } %>
end

--
-- ─── CHAT COMMANDS ──────────────────────────────────────────────────────────────
--

<% if (chatCmd) { %>
function <%- appName %>:ChatCommand(input)
    if not input or input:trim() == "" then
        OpenOptionsWindow()
    elseif input == 'help' then
        Util:Print('--- Available Commands ---')
        -- NOTE: Print other chat commands here
    else
        OpenOptionsWindow()
    end
end
<% } %>
