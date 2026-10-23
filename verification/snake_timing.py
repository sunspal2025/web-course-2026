"""Compare fixed-step movement under two simulated display refresh rates."""
from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto('http://127.0.0.1:8080/task6/')
    result = page.evaluate('''() => {
      cancelAnimationFrame(frame);
      window.requestAnimationFrame = () => 1;
      function simulate(fps) {
        startGame();
        apple = {x: 0, y: 0};
        for (let i = 0; i <= fps; i++) loop(i * 1000 / fps);
        return snake[0].x;
      }
      const at60 = simulate(60), at144 = simulate(144);
      startGame();
      snake = [{x:5,y:5},{x:5,y:6},{x:4,y:6},{x:4,y:5},{x:4,y:4},{x:5,y:4}];
      direction = directions.down;
      pendingDirection = direction;
      update();
      return {at60, at144, selfCollision: gameOver};
    }''')
    assert result['at60'] == result['at144'] == 11, result
    assert result['selfCollision'], result
    print('PASS: 60/144 fps produce six moves; self-collision ends the game.', result)
    browser.close()
