import { useState } from 'react';
import './GameInfoTabs.css';

export function GameInfoTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [activePage, setActivePage] = useState(0);
  
  const tabs = ['About Claim', 'Rules', 'Strategy', 'Scoring'];

  // Content pages for each tab
  const tabContent = {
    0: [ // About Claim - 3 pages
      {
        title: '⚔️ CLAIM ⚔️',
        subtitle: 'Simple Rules. Deadly Game.',
        content: (
          <>
            <div className="content-section">
              <h3>The Soul of the Game</h3>
              <p>
                Imagine a game so simple, you can learn it in three minutes. But a game so brutal, 
                it can end in thirty seconds. A game where a single card can be a triumph or a trap, 
                and hesitation is the deadliest sin of all.
              </p>
              <p>This is <strong>CLAIM</strong>.</p>
              <p>
                It's a high-stakes duel of wits and nerve played with a standard deck of cards. 
                You are dealt a mere three cards, and in that hand could be the key to a triumphant 
                victory or a crippling, debt-ridden loss.
              </p>
              <p>
                The goal is to accumulate points by hoarding cards of a single suit. But to score, 
                you must publicly <strong>Declare</strong> that suit, painting a target on your back 
                for every other player to see.
              </p>
            </div>
          </>
        )
      },
      {
        title: 'The Core Tension',
        subtitle: 'What makes CLAIM unique',
        content: (
          <div className="content-section">
            <div className="rule-block">
              <h4>⚡ The Ever-Present Threat</h4>
              <p>
                At any moment, any player can slam their cards down and force a <strong>Showdown</strong>. 
                Those who were slow to commit, who were still building their hand or waiting for the 
                perfect moment, are punished with severe, multiplied negative points.
              </p>
            </div>
            <div className="rule-block">
              <h4>💥 Lightning Fast Victories</h4>
              <p>
                A player lucky enough to start with a simple 2-3-4 run can end the game in a single, 
                brutal "ambush" move. A player with only high cards like Ace and King can go all-in 
                on a <strong>"High Card Gambit"</strong> and still win.
              </p>
            </div>
            <p className="highlight">
              This is a game where <strong>aggression is rewarded</strong>, patience is a monumental 
              risk, and the clock is always ticking.
            </p>
          </div>
        )
      },
      {
        title: 'Game Setup',
        subtitle: 'Everything you need to start',
        content: (
          <div className="content-section">
            <div className="setup-grid">
              <div className="setup-item">
                <span className="setup-icon">👥</span>
                <strong>4 Players</strong>
                <span className="setup-detail">Perfect for groups</span>
              </div>
              <div className="setup-item">
                <span className="setup-icon">🃏</span>
                <strong>52-Card Deck</strong>
                <span className="setup-detail">No Jokers</span>
              </div>
              <div className="setup-item">
                <span className="setup-icon">🎴</span>
                <strong>3 Starting Cards</strong>
                <span className="setup-detail">Each player</span>
              </div>
              <div className="setup-item">
                <span className="setup-icon">💰</span>
                <strong>1352 Point Budget</strong>
                <span className="setup-detail">Max penalty</span>
              </div>
            </div>
            <div className="rule-block">
              <h4>Initial Setup</h4>
              <ol>
                <li>The dealer is not a player but a role that rotates</li>
                <li>Randomly select a player to act as the dealer</li>
                <li>Dealer shuffles and deals 3 cards to each player</li>
                <li>Remaining 40 cards form the draw pile</li>
              </ol>
            </div>
          </div>
        )
      }
    ],
    1: [ // Rules - 6 pages
      {
        title: '📖 Game Flow Overview',
        subtitle: 'The two main phases',
        content: (
          <div className="content-section">
            <div className="rule-block">
              <h4>Phase 1: Initial Declaration (Simultaneous)</h4>
              <p>All players simultaneously decide whether to declare a suit:</p>
              <ul>
                <li><strong>Declare:</strong> Choose a suit and optionally place face-up cards</li>
                <li><strong>Don't Declare:</strong> Take an immediate penalty based on your highest card</li>
              </ul>
              <p><strong>Timing:</strong> 30-second countdown → "3, 2, 1" count → simultaneous reveal</p>
            </div>
            <div className="rule-block">
              <h4>Phase 2: Floor Card Rounds</h4>
              <ol>
                <li>Dealer reveals one card face-up as the <strong>Floor Card</strong></li>
                <li>Starting with a randomly selected player, each takes one action</li>
                <li>Unused Floor Cards go to bottom of draw pile</li>
              </ol>
              <p><strong>Dealer Rotation:</strong> New random dealer each round for fairness</p>
            </div>
          </div>
        )
      },
      {
        title: 'Player Actions',
        subtitle: 'What you can do each turn',
        content: (
          <div className="content-section">
            <div className="rule-block">
              <h4>Action 1: Pick Up</h4>
              <p>Take the Floor Card and optionally discard one card from your hand</p>
            </div>
            <div className="rule-block">
              <h4>Action 2: Pass</h4>
              <p>Decline the Floor Card (but accumulate penalty if not declared)</p>
            </div>
            <div className="rule-block">
              <h4>Action 3: Declare</h4>
              <p>Publicly commit to a suit. Two options:</p>
              <ul>
                <li><strong>Partial:</strong> Simply declare a suit without showing cards</li>
                <li><strong>Full:</strong> Place one or more face-up cards of the same suit</li>
              </ul>
            </div>
            <div className="rule-block">
              <h4>Action 4: Showdown</h4>
              <p>Call for a Showdown (must meet minimum 27 points requirement)</p>
            </div>
          </div>
        )
      },
      {
        title: 'Showdown Requirements',
        subtitle: 'When you can end the game',
        content: (
          <>
            <div className="content-section">
              <div className="rule-block">
                <h4>Requirements to Call Showdown</h4>
                <ul>
                  <li>✓ Must have declared a suit</li>
                  <li>✓ Minimum 27 points (using Hoarder's Multiplier)</li>
                  <li>✓ Can include cards picked up from the table</li>
                </ul>
              </div>
              <div className="rule-block">
                <h4>Calculation Examples</h4>
                <div className="example">
                  <strong>Example 1:</strong> A, K of same suit<br/>
                  (14 + 13) × 2 = <span className="result">54 points ✓</span>
                </div>
                <div className="example">
                  <strong>Example 2:</strong> 2, 3, 4 of same suit<br/>
                  (2 + 3 + 4) × 3 = <span className="result">27 points ✓</span>
                </div>
              </div>
              <p className="highlight">
                <strong>⚡ Blitz Showdown:</strong> Can be called immediately after initial 
                declaration phase! This is the ultimate ambush move.
              </p>
            </div>
          </>
        )
      },
      {
        title: '🎴 Card Values',
        subtitle: 'Know your numbers',
        content: (
          <div className="content-section">
            <h3>Card Values</h3>
            <div className="card-values">
              <span>A = 14</span>
              <span>K = 13</span>
              <span>Q = 12</span>
              <span>J = 11</span>
              <span>10 = 10</span>
              <span>9 = 9</span>
              <span>8 = 8</span>
              <span>7 = 7</span>
              <span>6 = 6</span>
              <span>5 = 5</span>
              <span>4 = 4</span>
              <span>3 = 3</span>
              <span>2 = 2</span>
            </div>
            <div className="rule-block">
              <h4>Important Notes</h4>
              <ul>
                <li>Aces are HIGH (14 points)</li>
                <li>No Jokers in this game</li>
                <li>Sequences can wrap around (A-K-Q or 3-2-A)</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        title: 'Penalties & Budget',
        subtitle: 'The cost of hesitation',
        content: (
          <div className="content-section">
            <div className="budget-info">
              <h3>🏦 Player Budget</h3>
              <p>Each player starts with <strong>1352 points</strong></p>
              <div className="formula">(14+13+12+11+10+9+8+7+6+5+4+3+2) × 13 = 1352</div>
              <p>This represents the maximum possible penalty a player could accumulate.</p>
            </div>
            <div className="rule-block">
              <h4>When Penalties Accrue</h4>
              <ul>
                <li>Don't declare in Phase 1: Penalty = highest card value</li>
                <li>Pass on Floor Card without declaring: Ongoing penalties</li>
                <li>Hold non-declared suit cards at Showdown: Sum of their values</li>
              </ul>
            </div>
            <p className="highlight">
              <strong>Key Rule:</strong> Penalties are included in Showdown calculations. 
              Your positive score must exceed your penalties to call a valid Showdown.
            </p>
          </div>
        )
      },
      {
        title: 'Example: Multi-Round Play',
        subtitle: 'See how it all works together',
        content: (
          <div className="content-section">
            <div className="example-block">
              <h4>Round 1:</h4>
              <p><strong>Player B's Hand:</strong> K♠, Q♠, J♠</p>
              <p>Player B doesn't declare → Takes 13-point penalty</p>
              <p><strong>Floor Card:</strong> 10♠ → Player B picks it up, may discard</p>
            </div>
            <div className="example-block">
              <h4>Round 2:</h4>
              <p><strong>Player B's Hand:</strong> K♠, Q♠, J♠, 10♠</p>
              <p>Player B declares Spades!</p>
              <p><strong>Floor Card:</strong> 9♥ → Player B passes</p>
            </div>
            <div className="example-block">
              <h4>Showdown Called by Player B:</h4>
              <div className="calculation">
                <div className="calc-step">
                  <strong>Sequence (10-J-Q-K):</strong><br/>
                  (10 + 11 + 12 + 13) × 4 = <span className="result">184 points</span>
                </div>
                <div className="calc-step"><strong>Penalty:</strong> 0</div>
                <div className="calc-total">
                  <strong>Final Score:</strong> <span className="total-score">184 points</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ],
    2: [ // Strategy - 5 pages
      {
        title: '🧠 Core Tactics',
        subtitle: 'Master these to win',
        content: (
          <div className="content-section">
            <div className="strategy-block">
              <h4>🎯 The High Card Gambit</h4>
              <p>
                An all-in strategy using high-value cards (A, K, Q) to win a Blitz Showdown, 
                even without a run. It's a statement of pure aggression.
              </p>
              <p className="example">
                <strong>Example:</strong> A♦, K♦<br/>
                (14 + 13) × 2 = <strong>54 points</strong><br/>
                Declare immediately and call Showdown!
              </p>
            </div>
            <div className="strategy-block">
              <h4>💥 The Ambush & Rebuttal</h4>
              <p>
                The core offensive/defensive dynamic. An aggressive player calls a Showdown 
                with a weak but legal hand, hoping no one can counter. A defensive player 
                holds a strong 3-card run, waiting to survive the ambush and turn the tables.
              </p>
            </div>
          </div>
        )
      },
      {
        title: 'Timing & Pressure',
        subtitle: 'The psychological warfare',
        content: (
          <div className="content-section">
            <div className="strategy-block">
              <h4>⏰ The Ticking Clock</h4>
              <p>
                Your hand size is your potential penalty. The longer you wait, the more 
                devastating a sudden Showdown becomes. This forces action and prevents stagnation.
              </p>
              <ul>
                <li>3 cards: Manageable risk</li>
                <li>5 cards: Moderate danger</li>
                <li>7+ cards: Disaster waiting to happen</li>
              </ul>
            </div>
            <div className="strategy-block">
              <h4>⚖️ Patience vs. Aggression</h4>
              <p>
                The central tension of CLAIM. Do you call a Showdown with a decent hand now, 
                or wait for a perfect one and risk someone else ending the game first?
              </p>
              <p className="key-insight">
                In CLAIM, the player who acts <strong>decisively</strong> often wins over 
                the player who waits for <strong>perfection</strong>.
              </p>
            </div>
          </div>
        )
      },
      {
        title: 'The Open Floor Strategy',
        subtitle: 'Blocking and vulnerability',
        content: (
          <div className="content-section">
            <div className="strategy-block">
              <h4>🚧 The Art of the Block</h4>
              <p>
                The rule that <strong>anyone</strong> can pick up a Floor Card makes declaring 
                a suit a terrifying act of vulnerability. Once you declare Spades, every Spade 
                that appears becomes a target for your opponents to steal.
              </p>
              <p className="example">
                <strong>Scenario:</strong> You declare Spades. The A♠ appears on the Floor.<br/>
                Your opponent picks it up just to block you.<br/>
                <strong>Result:</strong> You're denied a 14-point card, and they now hold a 
                dangerous penalty card (14 points if they're not in Spades).
              </p>
            </div>
            <p className="highlight">
              Watching an opponent pick up the Ace you desperately need is a special kind of pain.
            </p>
          </div>
        )
      },
      {
        title: 'Advanced Tactics',
        subtitle: 'For experienced players',
        content: (
          <div className="content-section">
            <div className="strategy-block advanced">
              <h4>👑 The Kingmaker</h4>
              <p>
                In a 4-player game where Player A has an unbeatable hand, Player D (with no 
                chance of winning) can decide who loses the <em>most</em>. By strategically 
                picking up or declining cards, they can sabotage one opponent to help another, 
                effectively choosing second place.
              </p>
              <p><strong>This isn't a flaw; it's a feature.</strong> It's a core part of the 
              psychological warfare in multiplayer games.</p>
            </div>
            <div className="strategy-block advanced">
              <h4>🔗 Information Cascade</h4>
              <p>
                Player A declares Spades. The A♠ appears. Player C (who doesn't need Spades) 
                picks it up just to block Player A.
              </p>
              <p><strong>The Consequence:</strong> Player C now has a powerful penalty card 
              (14 points) in hand, significantly increasing their own risk.</p>
              <p className="example">
                <strong>The Dilemma:</strong> "Do I hurt my opponent now at the cost of 
                hurting myself more later?" The act of blocking is itself a risk.
              </p>
            </div>
          </div>
        )
      },
      {
        title: 'Degenerate Strategies',
        subtitle: 'When winning isn\'t the goal',
        content: (
          <div className="content-section">
            <div className="strategy-block advanced">
              <h4>😈 The Passive Aggressor</h4>
              <p>
                A controversial strategy where a player's goal is not to win, but to ensure 
                another <em>specific</em> player loses. This player:
              </p>
              <ul>
                <li>Never declares a suit</li>
                <li>Picks up every card of their target's suit</li>
                <li>Accumulates a massive negative score</li>
                <li>Successfully torpedoes their rival's game</li>
              </ul>
              <p className="highlight">
                <strong>Warning:</strong> This will make you very unpopular at game night. 
                But in high-stakes games or grudge matches, it's a legitimate (if brutal) tactic.
              </p>
            </div>
            <p className="key-insight">
              CLAIM is more than a game of cards; it's a game of <strong>people</strong>. 
              Politics, alliances, and rivalries all come into play.
            </p>
          </div>
        )
      }
    ],
    3: [ // Scoring - 4 pages
      {
        title: "💰 Hoarder's Multiplier",
        subtitle: 'The core scoring system',
        content: (
          <div className="content-section">
            <div className="scoring-block">
              <h4>For Players Who Declared a Suit</h4>
              <ol className="scoring-steps">
                <li><strong>Find all sequences</strong> of consecutive cards in your declared suit</li>
                <li><strong>For each sequence:</strong>
                  <div className="formula">(Sum of card values) × (Number of cards)</div>
                </li>
                <li><strong>Total Positive Points</strong> = Sum of all sequence scores</li>
                <li><strong>Subtract penalties</strong> from non-declared suit cards</li>
                <li><strong>Final Score</strong> = Positive Points - Penalty</li>
              </ol>
            </div>
            <div className="rule-block">
              <h4>Key Rules</h4>
              <ul>
                <li>Sequences can wrap around (A-K or 3-2-A)</li>
                <li>Each sequence calculated separately</li>
                <li>Only cards of your declared suit count as positive</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        title: 'Scoring Example 1',
        subtitle: 'Multiple sequences',
        content: (
          <div className="content-section">
            <div className="example-block">
              <h4>Example: Multiple Sequences</h4>
              <p><strong>Hand:</strong> A♠, K♠, 2♠, 3♠, 4♠, 5♠ (Spades declared)</p>
              <div className="calculation">
                <div className="calc-step">
                  <strong>Sequence 1 (A-K):</strong><br/>
                  (14 + 13) × 2 = <span className="result">54 points</span>
                </div>
                <div className="calc-step">
                  <strong>Sequence 2 (2-3-4-5):</strong><br/>
                  (2 + 3 + 4 + 5) × 4 = <span className="result">56 points</span>
                </div>
                <div className="calc-step">
                  <strong>Total Positive Points:</strong> 54 + 56 = 110
                </div>
                <div className="calc-step"><strong>Penalty:</strong> 0 (all cards are Spades)</div>
                <div className="calc-total">
                  <strong>Final Score:</strong> <span className="total-score">110 points</span>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Undeclared Players',
        subtitle: 'Heavy penalties',
        content: (
          <div className="content-section">
            <div className="scoring-block">
              <h4>For Players Who Did NOT Declare</h4>
              <ol className="scoring-steps">
                <li>Identify all sequences in <strong>ANY suit</strong></li>
                <li>For each sequence: (Sum of values) × (Number of cards)</li>
                <li><strong>Total = -(Sum of all sequence scores)</strong></li>
                <li>If no sequences: Sum all card values as negative</li>
              </ol>
            </div>
            <div className="example-block">
              <h4>Example with Sequences</h4>
              <p><strong>Hand:</strong> A♠, K♠, 2♥, 3♥, 4♥, 5♥ (NO declaration)</p>
              <div className="calculation">
                <div className="calc-step">
                  Seq 1 (A-K♠): (14+13) × 2 = 54
                </div>
                <div className="calc-step">
                  Seq 2 (2-3-4-5♥): (2+3+4+5) × 4 = 56
                </div>
                <div className="calc-total">
                  <strong>Total:</strong> <span className="total-score">-110 points</span>
                </div>
              </div>
            </div>
            <div className="example-block">
              <h4>Example with No Sequences</h4>
              <p><strong>Hand:</strong> J♥, 9♦, 7♠, 4♣, 3♣</p>
              <div className="calculation">
                <div className="calc-step">
                  Sum: -(11 + 9 + 7 + 4 + 3)
                </div>
                <div className="calc-total">
                  <strong>Total:</strong> <span className="total-score">-34 points</span>
                </div>
              </div>
            </div>
          </div>
        )
      },
      {
        title: 'Complex Payment Example',
        subtitle: 'How money moves in a Showdown',
        content: (
          <div className="content-section">
            <div className="example-block">
              <h4>Showdown Called by Player A</h4>
              <div className="calculation">
                <div className="calc-step">
                  <strong>Player A (declared ♦):</strong> A♦, K♦, Q♦<br/>
                  Seq (Q-K-A): (12+13+14) × 3 = <span className="result">117 points</span>
                </div>
                <div className="calc-step">
                  <strong>Player B (declared ♠):</strong> J♠, 10♠, 9♠<br/>
                  Seq (9-10-J): (9+10+11) × 3 = <span className="result">90 points</span>
                </div>
                <div className="calc-step">
                  <strong>Player C (undeclared):</strong> A♥, K♥, 2♣, 3♣, 4♣<br/>
                  Seq 1: (14+13) × 2 = 54, Seq 2: (2+3+4) × 3 = 27<br/>
                  Total: <span className="result">-81 points</span>
                </div>
                <div className="calc-step">
                  <strong>Player D (declared ♠):</strong> 2♠, 3♠, 4♠, 5♠<br/>
                  Seq (2-3-4-5): (2+3+4+5) × 4 = <span className="result">56 points</span>
                </div>
              </div>
            </div>
            <div className="payment-rules">
              <h4>💸 Payments</h4>
              <p><strong>Player A (winner) receives:</strong></p>
              <ul>
                <li>From Player B: 117 - 90 = <strong>27 points</strong></li>
                <li>From Player C: 117 - (-81) = <strong>198 points</strong></li>
                <li>From Player D: 117 - 56 = <strong>61 points</strong></li>
              </ul>
              <p><strong>Total winnings: 286 points</strong></p>
            </div>
          </div>
        )
      }
    ]
  };

  const currentTabPages = tabContent[activeTab as keyof typeof tabContent];
  const totalPages = currentTabPages.length;

  const handlePrevPage = () => {
    setActivePage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNextPage = () => {
    setActivePage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setActivePage(0); // Reset to first page when changing tabs
  };

  const currentPage = currentTabPages[activePage];

  return (
    <div className="game-info-tabs">
      <div className="tabs-header">
        <div className="tabs-list">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="tabs-content">
        <div className="tab-panel">
          <h2 className="tab-heading">{currentPage.title}</h2>
          <p className="tab-subtitle">{currentPage.subtitle}</p>
          {currentPage.content}
        </div>

        <div className="tabs-footer">
          <button 
            className="tab-nav-btn" 
            onClick={handlePrevPage}
            aria-label="Previous page"
          >
            ← Previous
          </button>
          
          <div className="page-indicator">
            {activePage + 1} / {totalPages}
          </div>
          
          <button 
            className="tab-nav-btn" 
            onClick={handleNextPage}
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
