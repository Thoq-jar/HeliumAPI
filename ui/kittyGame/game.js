$(() => {
  let score = 0;
  let isJumping = false;
  let obstacleSpeed = 5;
  let gameOver = false;

  const $obstacle = $(".obstacle");
  const $cat = $(".cat");
  const $score = $("#score");
  const $gameOver = $(".game-over");
  const $finalScore = $("#final-score");

  function startGame() {
    gameOver = false;
    $obstacle.css("right", "-40px");
    score = 0;
    obstacleSpeed = 10;
    $score.text(score.toString());
    $gameOver.hide();
    gameLoop();
  }

  function gameLoop() {
    if (!gameOver) {
      moveObstacle();
      requestAnimationFrame(gameLoop);
    }
  }

  function moveObstacle() {
    const obstaclePositionStr = $obstacle.css("right");
    const obstaclePosition = obstaclePositionStr
      ? parseInt(obstaclePositionStr, 10)
      : 0;

    const windowWidth = $(window).width();
    if (windowWidth && obstaclePosition > windowWidth) {
      $obstacle.css("right", "-40px");
      score++;
      $score.text(score.toString());
      increaseDifficulty();
    } else {
      $obstacle.css("right", `${obstaclePosition + obstacleSpeed}px`);
    }

    if (collision()) endGame();
  }

  function increaseDifficulty() {
    if (score % 10 === 0 && score !== 0) obstacleSpeed -= 5;
    else obstacleSpeed += 1;
  }

  function collision() {
    const catOffset = $cat.offset();
    const obstacleOffset = $obstacle.offset();

    if (!catOffset || !obstacleOffset) return false;

    const catBottom = catOffset.top + ($cat.height() || 0);
    const catLeft = catOffset.left;
    const catRight = catLeft + ($cat.width() || 0);

    const obstacleTop = obstacleOffset.top;
    const obstacleLeft = obstacleOffset.left;
    const obstacleRight = obstacleLeft + ($obstacle.width() || 0);

    return (catBottom >= obstacleTop && catLeft < obstacleRight &&
      catRight > obstacleLeft);
  }

  function simulatePhysics(mode) {
    if (mode === "Jump") {
      if (!isJumping && !gameOver) {
        isJumping = true;
        $cat.animate(
          { bottom: "+=350px" },
          450,
          () =>
            $cat.animate({ bottom: "-=350px" }, 400, () => isJumping = false),
        );
      } else if (gameOver) startGame();
    }
  }

  function endGame() {
    gameOver = true;
    isJumping = false;
    $finalScore.text(score.toString());
    $gameOver.show();
  }

  $(document).on("keydown", (event) => {
    if (event.key === " ") simulatePhysics("Jump");
  });

  $(document).on("click", () => simulatePhysics("Jump"));

  startGame();
});
