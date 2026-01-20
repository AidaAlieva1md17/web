export default class Collision {
    checkPlayerCollision(attacker, defender, game) {
        // Не проверяем столкновения если кто-то умер
        if (attacker.state === 'death' || defender.state === 'death') return;
        
        // Проверяем столкновение только если атакующий в состоянии атаки
        if (attacker.state !== 'attacking') return;
        
        // Проверяем, что анимация атаки достигла кадров, когда должен наноситься урон
        let canDealDamage = false;
        let damage = 20; // Базовый урон
        
        // Определяем урон в зависимости от типа атаки
        if (attacker.currentAttackType === 'heavy') {
            damage = 30; // Увеличиваем урон для тяжелой атаки
        }
        
        if (attacker.isPlayer1) {
            // Для player1 урон наносится в кадрах 10-18 из 20
            canDealDamage = attacker.frameIndex >= 10 && attacker.frameIndex <= 18;
        } else {
            // Для player2 урон наносится в кадрах 3-6 из 7
            canDealDamage = attacker.frameIndex >= 3 && attacker.frameIndex <= 6;
        }
        
        // Проверяем столкновение и возможность нанести урон
        if (attacker.checkPlayerCollision(defender) && 
            canDealDamage && 
            !attacker.hasDealtDamage) {
            
            if (!defender.blocking) {
                defender.takeDamage(damage);
                attacker.hasDealtDamage = true;
                
                // Устанавливаем правильную анимацию получения урона
                if (defender.isPlayer1) {
                    // Если player1 получает удар, используем whitehit
                    defender.currentSprite = defender.sprites.whitehit || defender.sprites.hit || defender.sprites.idle;
                } else {
                    defender.currentSprite = defender.sprites.hurt || defender.sprites.idle;
                }
                defender.frameIndex = 0;
                defender.frameCounter = 0;
            } else {
                // При блоке наносим уменьшенный урон
                const blockedDamage = damage * 0.3;
                defender.takeDamage(blockedDamage);
                attacker.hasDealtDamage = true;
            }
        }
    }
}