// SCENE: wall — placeholder (to be replaced)
(() => {
  SCENES_REG.wall = {
    cues: [],
    draw(lt, t) { bgFill('#111'); T('wall', 540, 960, { size: 120, font: 'Anton' }); T(lt.toFixed(2), 540, 1100, { size: 60 }); },
  };
})();
