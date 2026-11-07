// SCENE: claude — placeholder (to be replaced)
(() => {
  SCENES_REG.claude = {
    cues: [],
    draw(lt, t) { bgFill('#111'); T('claude', 540, 960, { size: 120, font: 'Anton' }); T(lt.toFixed(2), 540, 1100, { size: 60 }); },
  };
})();
