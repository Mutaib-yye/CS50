// SCENE: cta — placeholder (to be replaced)
(() => {
  SCENES_REG.cta = {
    cues: [],
    draw(lt, t) { bgFill('#111'); T('cta', 540, 960, { size: 120, font: 'Anton' }); T(lt.toFixed(2), 540, 1100, { size: 60 }); },
  };
})();
