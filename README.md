# AoNTools
Browser extension for ease of using the Archives of Nethys 1st edition Pathfinder SRD

# Instructions
Download by pressing the green "Code" button and "Download ZIP", then add to your browser of choice.
On Firefox:
- Unpack the ZIP, then re-ZIP only the files (there has to be a better way but IDK)
- Go to "about:debugging" (just put it in the address bar) 
- Select "This Firefox" from the sidebar on the left
- Click "Load Temporary Add-on" and select the re-ZIP you made
- You have to do this every time you restart Firefox

On Chrome:
- Unpack the ZIP
- Go to "chrome://extensions/" (just put it in the address bar)
- Turn on "Developer Mode"
- Click "Load unpacked" and select the unpacked folder
- Chrome will ask you if you want to keep using it on every restart

# Features
You can hover over links for a preview, and unlike the AoN2e version you can scroll and click on links, as well as resize the window. There is a slight delay on it so that you don't open up 20 windows with one swipe on the search page.

Small improvements to the searches. The search bar in the left has a dropdown added under it that you can use to select categories (multiple ones if you hold ctrl while clicking). Also slightly improved layout so it might look better on mobile (if you can somehow get this to work on mobile).

Class Archtype page tool:
- Minor improvements to layout/CSS.
- Can click on the box containing the name of the archetype to highlight it (click again to remove)
- Can highlight multiple archetypes
- Highlighted archetypes' changes are matched against the changes of the other archetypes. Conflicting changes are highlighted in red (exact match) and yellow (partial match).
- Can press the "hide conflicts" button to hide all archetypes with an exact match.
- Can edit the archetype change lists. This is primarily useful because the tool is based on the original text that AoN supplies and it is somewhat inconsistent in formatting, but using the edits you can fix that for yourself. You can also change the ones that are just flat out wrong, or homebrewed, or make them more/less specific. When selecting an input with a change in it, you get a dropdown with all the values from the other changes (filtered by the input's value) for ease of use.
- Can add new lines for 3rd party or homebrewed archetypes, or just as a helpful tool if you really want to keep some features.
- Can save the changes to LocalStorage, as well as delete them. It takes some Javascript know-how, but could use this to import/export changes. If anybody wants to do the grunt-work of going through all the archetype changes and fixing all the obvious problems, send me the final save and I'll implement it in 1.0
