class RockPaperScissorsGame {
    constructor() {
        this.gameState = 'waiting'; // waiting, ready, countdown, choosing, result
        this.playerChoice = null;
        this.aiChoice = null;
        this.countdownTimeout = null;
        
        this.initElements();
        this.bindEvents();
        
        // 게임 시작 시 초기 상태
        this.resetGame();
    }
    
    initElements() {
        // 게임 화면 요소들
        this.gameScreen = document.getElementById('gameScreen');
        this.countdownOverlay = document.getElementById('countdownOverlay');
        this.countdownText = document.getElementById('countdownText');
        this.buttonContainer = document.getElementById('buttonContainer');
        this.startContainer = document.getElementById('startContainer');
        this.countdownStartContainer = document.getElementById('countdownStartContainer');
        this.resultContainer = document.getElementById('resultContainer');
        this.gameDescription = document.getElementById('gameDescription');
        this.fireworks = document.getElementById('fireworks');
        this.dogImageContainer = document.querySelector('.dog-image-container');
        
        // 승리 축하 요소들
        this.victoryCelebration = document.getElementById('victoryCelebration');
        this.dogVictoryCelebration = document.getElementById('dogVictoryCelebration');
        this.drawCelebration = document.getElementById('drawCelebration');
        this.flowerPetals = document.getElementById('flowerPetals');
        
        // 선택 표시 요소들
        this.aiChoiceDisplay = document.getElementById('aiChoice');
        this.playerChoiceDisplay = document.getElementById('playerChoice');
        this.resultMessage = document.getElementById('resultMessage');
        
        // 버튼들
        this.startBtn = document.getElementById('startBtn');
        this.countdownStartBtn = document.getElementById('countdownStartBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.choiceBtns = document.querySelectorAll('.choice-btn');
    }
    
    bindEvents() {
        // 게임 시작 버튼
        this.startBtn.addEventListener('click', () => this.showGameScreen());
        
        // 카운트다운 시작 버튼
        this.countdownStartBtn.addEventListener('click', () => this.startCountdown());
        
        // 다시하기 버튼
        this.restartBtn.addEventListener('click', () => this.resetGame());
        
        // 선택 버튼들 - 카운트다운 중에만 동작
        this.choiceBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('Button clicked, gameState:', this.gameState);
                if (this.gameState === 'countdown' || this.gameState === 'choosing') {
                    this.makeChoice(e.currentTarget.dataset.choice);
                }
            });
        });
    }
    
    resetGame() {
        this.gameState = 'waiting';
        this.playerChoice = null;
        this.aiChoice = null;
        
        // 타임아웃 클리어
        if (this.countdownTimeout) {
            clearTimeout(this.countdownTimeout);
            this.countdownTimeout = null;
        }
        
        // UI 초기화
        this.gameScreen.style.display = 'none';
        this.countdownOverlay.style.display = 'none';
        this.buttonContainer.style.display = 'none';
        this.startContainer.style.display = 'block';
        this.countdownStartContainer.style.display = 'none';
        this.resultContainer.style.display = 'none';
        this.gameDescription.style.display = 'block';
        this.dogImageContainer.style.display = 'flex';
        this.fireworks.style.display = 'none';
        this.victoryCelebration.style.display = 'none';
        this.dogVictoryCelebration.style.display = 'none';
        this.drawCelebration.style.display = 'none';
        this.flowerPetals.style.display = 'none';
        
        // 선택 표시 초기화
        this.aiChoiceDisplay.innerHTML = '<span class="choice-icon">❓</span>';
        this.playerChoiceDisplay.innerHTML = '<span class="choice-icon">❓</span>';
        
        // 버튼 초기화 (대기 상태에서는 비활성화)
        this.disableButtons();
        
        // 폭죽 및 꽃놀이 효과 제거
        this.fireworks.innerHTML = '';
        this.flowerPetals.innerHTML = '';
    }
    
    showGameScreen() {
        this.gameState = 'ready';
        
        // UI 전환
        this.startContainer.style.display = 'none';
        this.gameDescription.style.display = 'none';
        this.dogImageContainer.style.display = 'none';
        this.gameScreen.style.display = 'block';
        this.buttonContainer.style.display = 'flex';
        this.countdownStartContainer.style.display = 'block';
        
        // ready 상태에서는 버튼 비활성화 (카운트다운 시작 전까지)
        this.disableButtons();
    }
    
    startCountdown() {
        this.gameState = 'countdown';
        console.log('🚀 카운트다운 시작 - 버튼 즉시 활성화');
        
        // 카운트다운 버튼 숨기기
        this.countdownStartContainer.style.display = 'none';
        
        // 🔥 카운트다운 시작과 동시에 선택 버튼 강력하게 활성화
        this.forceEnableButtons();
        
        const countdownSequence = ['가위', '바위', '보', '내세요'];
        const timings = [900, 900, 900, 500]; // 가위, 바위, 보: 0.9초, 내세요: 0.5초
        let currentIndex = 0;
        
        this.countdownOverlay.style.display = 'flex';
        
        const showNext = () => {
            if (currentIndex < countdownSequence.length && this.gameState === 'countdown') {
                this.countdownText.textContent = countdownSequence[currentIndex];
                console.log('카운트다운:', countdownSequence[currentIndex], `- ${timings[currentIndex]}ms 노출`);
                
                // 매 카운트다운마다 버튼이 활성화 상태인지 재확인
                this.forceEnableButtons();
                
                // 애니메이션을 다시 시작하기 위해 클래스 제거 후 추가
                this.countdownText.style.animation = 'none';
                setTimeout(() => {
                    this.countdownText.style.animation = 'countdownPulse 0.5s ease-in-out';
                }, 10);
                
                const currentTiming = timings[currentIndex];
                currentIndex++;
                this.countdownTimeout = setTimeout(showNext, currentTiming);
            } else if (this.gameState === 'countdown') {
                // 카운트다운 종료 - '내세요' 표시 후 다음 단계로
                this.countdownTimeout = setTimeout(() => {
                    if (this.gameState === 'countdown') {
                        this.countdownOverlay.style.display = 'none';
                        this.gameState = 'choosing';
                        // 카운트다운 종료 후에도 버튼은 계속 활성화
                        this.forceEnableButtons();
                    }
                }, 100); // 즉시 전환
            }
        };
        
        showNext();
    }
    
    forceEnableButtons() {
        console.log('💪 강력한 버튼 활성화 실행');
        this.choiceBtns.forEach(btn => {
            // 모든 클래스 제거 후 enabled 클래스 추가
            btn.classList.remove('disabled');
            btn.classList.add('enabled');
            
            // 인라인 스타일로 강제 설정
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.style.transform = '';
            
            console.log('버튼 활성화됨:', btn.dataset.choice, btn.style.pointerEvents, btn.style.opacity);
        });
    }
    
    enableButtons() {
        console.log('버튼 활성화 실행');
        this.forceEnableButtons();
    }
    
    disableButtons() {
        console.log('버튼 비활성화 실행');
        this.choiceBtns.forEach(btn => {
            btn.classList.remove('enabled');
            btn.classList.add('disabled');
            
            // 인라인 스타일로 강제 비활성화
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.4';
            btn.style.cursor = 'not-allowed';
        });
    }
    
    makeChoice(choice) {
        // 이미 선택했다면 무시
        if (this.playerChoice) return;
        
        console.log('선택됨:', choice);
        this.playerChoice = choice;
        this.aiChoice = this.generateAIChoice();
        
        // 카운트다운 중단
        if (this.countdownTimeout) {
            clearTimeout(this.countdownTimeout);
            this.countdownTimeout = null;
        }
        
        // 카운트다운 오버레이 즉시 숨기기
        this.countdownOverlay.style.display = 'none';
        
        // 선택 완료 후 버튼 비활성화
        this.disableButtons();
        
        // 선택 결과 표시
        this.displayChoices();
        
        // 결과 판단 및 표시
        setTimeout(() => {
            this.showResult();
        }, 1000);
    }
    
    generateAIChoice() {
        const choices = ['scissors', 'rock', 'paper'];
        return choices[Math.floor(Math.random() * choices.length)];
    }
    
    displayChoices() {
        const choiceIcons = {
            scissors: '✌️',
            rock: '✊',
            paper: '✋'
        };
        
        // 강아지 선택 표시
        this.aiChoiceDisplay.innerHTML = `<span class="choice-icon">${choiceIcons[this.aiChoice]}</span>`;
        
        // 고객님 선택 표시
        this.playerChoiceDisplay.innerHTML = `<span class="choice-icon">${choiceIcons[this.playerChoice]}</span>`;
    }
    
    showResult() {
        this.gameState = 'result';
        
        const result = this.determineWinner();
        let message = '';
        let resultClass = '';
        
        switch (result) {
            case 'win':
                message = '🎉 고객님 승리! 음료수 한잔!!';
                resultClass = 'win';
                this.triggerVictoryCelebration(); // 특별한 승리 축하 효과
                break;
            case 'lose':
                message = '😢 강아지 승리! 아쉬어요!';
                resultClass = 'lose';
                this.triggerDogVictoryCelebration(); // 강아지 승리 축하 효과
                break;
            case 'draw':
                message = '🤝 비겼습니다.';
                resultClass = 'draw';
                this.triggerDrawCelebration(); // 무승부 축하 효과
                break;
        }
        
        this.resultMessage.textContent = message;
        this.resultMessage.className = `result-message ${resultClass}`;
        this.resultContainer.style.display = 'block';
    }
    
    triggerVictoryCelebration() {
        // 승리 축하 화면 표시
        this.victoryCelebration.style.display = 'flex';
        
        // 🎆 슈퍼 폭죽 효과
        this.fireworks.style.display = 'block';
        
        // 대형 폭죽들
        for (let i = 0; i < 10; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework super';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 60 + '%';
            this.fireworks.appendChild(firework);
        }
        
        // 추가 폭죽들
        for (let i = 0; i < 15; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework large';
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 80 + '%';
            this.fireworks.appendChild(firework);
        }
        
        // 🌸 꽃놀이 효과
        this.flowerPetals.style.display = 'block';
        
        // 꽃잎들 생성 (5단계로 나누어서)
        for (let wave = 0; wave < 5; wave++) {
            setTimeout(() => {
                for (let i = 0; i < 12; i++) {
                    const petal = document.createElement('div');
                    petal.className = 'petal';
                    petal.style.left = Math.random() * 100 + '%';
                    petal.style.animationDelay = Math.random() * 2 + 's';
                    petal.style.animationDuration = (3 + Math.random() * 2) + 's';
                    this.flowerPetals.appendChild(petal);
                }
            }, wave * 500);
        }
        
        // 7초 후 축하 화면 숨기기
        setTimeout(() => {
            this.victoryCelebration.style.display = 'none';
            this.fireworks.style.display = 'none';
            this.flowerPetals.style.display = 'none';
            this.fireworks.innerHTML = '';
            this.flowerPetals.innerHTML = '';
        }, 5000);
    }
    
    triggerDogVictoryCelebration() {
        // 강아지 승리 축하 화면 표시 (효과 없이 이미지와 메시지만)
        this.dogVictoryCelebration.style.display = 'flex';
        
        // 7초 후 축하 화면 숨기기
        setTimeout(() => {
            this.dogVictoryCelebration.style.display = 'none';
        }, 7000);
    }
    
    triggerDrawCelebration() {
        // 무승부 축하 화면 표시 (효과 없이 이미지와 메시지만)
        this.drawCelebration.style.display = 'flex';
        
        // 5초 후 축하 화면 숨기기
        setTimeout(() => {
            this.drawCelebration.style.display = 'none';
        }, 5000);
    }
    
    determineWinner() {
        if (this.playerChoice === this.aiChoice) {
            return 'draw';
        }
        
        // 승리 조건: 가위 > 보, 보 > 바위, 바위 > 가위
        const winConditions = {
            scissors: 'paper',  // 가위는 보를 이김
            paper: 'rock',      // 보는 바위를 이김
            rock: 'scissors'    // 바위는 가위를 이김
        };
        
        return winConditions[this.playerChoice] === this.aiChoice ? 'win' : 'lose';
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    new RockPaperScissorsGame();
}); 