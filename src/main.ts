function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "shot", "se", "rock", "se2"]
	});
	scene.loaded.add(() => {
		// ここからゲーム内容を記述します

		// プレイヤーを生成します
		const player = new g.Sprite({
			scene: scene,
			src: scene.assets["player"],
			width: (scene.assets["player"] as g.ImageAsset).width,
			height: (scene.assets["player"] as g.ImageAsset).height
		});
		let playerVel = 0;
		player.x = 10;
		player.y = g.game.height - player.height;
		player.update.add(() => 
		{
			playerVel -= 0.5;
			player.y -= playerVel;
			if(player.y > g.game.height - player.height)
			{
				playerVel = 0;
				player.y = g.game.height - player.height;
			}
			player.modified();
		});
		player.update.add(() => 
		{
			if(Math.random() < 0.001)
			{
				let rock = createRock(scene);
				rock.update.add(() => 
				{
					const distLimit = 70
					let distX = Math.abs(player.x - rock.x);
					let distY = Math.abs(player.y - rock.y);
					let sqrtMag = Math.pow(distX, 2) + Math.pow(distY, 2)
					
					if(sqrtMag < Math.pow(distLimit, 2))
					{
						scene.remove(player);
						(scene.assets["se2"] as g.AudioAsset).play();
					}
				})
			}
		})
		scene.append(player);

		
		scene.pointDownCapture.add(() => 
		{
			(scene.assets["se"] as g.AudioAsset).play();
			playerVel += 15;
		});
	});
	g.game.pushScene(scene);
}

function createRock(scene: g.Scene) : g.Sprite
{
	const rock = new g.Sprite({
		scene : scene,
		src : scene.assets["rock"],
		width: (scene.assets["rock"] as g.ImageAsset).width,
		height: (scene.assets["rock"] as g.ImageAsset).height
	})
	rock.x = g.game.width - rock.width;
	rock.y = g.game.height - rock.height;
	rock.update.add(() => 
	{
		rock.x --;
		if(rock.x + rock.width < 0)
		{
			scene.remove(rock);
		}
	});
	scene.append(rock);

	return rock;
}

export = main;
