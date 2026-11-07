// SCENE: course — placeholder (to be replaced)
(() => {
  SCENES_REG.course = {
    cues: [],
    draw(lt, t) { bgFill('#111'); T('course', 540, 960, { size: 120, font: 'Anton' }); T(lt.toFixed(2), 540, 1100, { size: 60 }); },
  };
})();
