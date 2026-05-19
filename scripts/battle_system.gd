extends Node

# ===== 参照 =====
var board

# ===== 戦闘パラメータ =====
const BASE_ATK = 150  # モードA（面積勝利型）
const TICK_INTERVAL = 5.0  # 5秒ごと

# ===== HP =====
var my_hp = 2000.0
var enemy_hp = 2000.0

# ===== タイマー =====
var tick_timer = 0.0
var game_timer = 0.0
var tick_count = 0

# ===== 封印ゲージ =====
var seal_gauge = 0.0

# ===== シグナル =====
signal hp_changed(my_hp, enemy_hp)
signal tick_fired(damage, tick_num)
signal game_over(winner)

func _ready():
	print("戦闘システム起動開始...")

	# 親ノードを確認
	var parent = get_parent()
	print("親ノード: ", parent.name if parent else "なし")

	# Boardノードを探す
	if parent and parent.has_node("Board"):
		board = parent.get_node("Board")
		print("✓ Boardノード見つかりました！")
		print("戦闘システム起動！")
	else:
		print("❌ エラー：Boardノードが見つかりません")
		print("親の子ノード一覧:")
		if parent:
			for child in parent.get_children():
				print("  - ", child.name)

func _process(delta):
	if not board:
		return  # Boardが見つからない場合は何もしない

	# ゲームタイマー
	game_timer += delta

	# ティックタイマー
	tick_timer += delta
	if tick_timer >= TICK_INTERVAL:
		fire_tick()
		tick_timer = 0.0

	# 60秒で終了
	if game_timer >= 60.0:
		end_game()

# ===== ティック処理 =====
func fire_tick():
	if not board:
		return

	tick_count += 1
	print("\n===== ティック %d 発動！ =====" % tick_count)

	# 1. 盤面指標を計算
	var metrics = calculate_metrics()
	print("支配率: %.1f%%, 連結率: %.1f%%, 拠点: %.1f%%" % [
		metrics.area * 100,
		metrics.cluster * 100,
		metrics.control * 100
	])

	# 2. 攻撃力計算
	var offense = 0.5 * metrics.area + 0.3 * metrics.cluster + 0.2 * metrics.control

	# 3. 防御力計算（敵の連結率から）
	var DR = clamp(0.35 * metrics.enemy_cluster, 0.0, 0.35)

	# 4. ダメージ確定
	var damage = BASE_ATK * offense * (1.0 - DR)
	enemy_hp -= damage

	print("攻撃力: %.2f, 防御率: %.2f, ダメージ: %.1f" % [offense, DR, damage])
	print("敵HP: %.1f → %.1f" % [enemy_hp + damage, enemy_hp])

	# 5. 封印ゲージ蓄積
	seal_gauge += 18 * metrics.control + 8 * metrics.area
	if seal_gauge >= 100:
		activate_seal()

	# シグナル発火
	emit_signal("hp_changed", my_hp, enemy_hp)
	emit_signal("tick_fired", damage, tick_count)

	# 勝敗チェック
	if enemy_hp <= 0:
		emit_signal("game_over", "player")
		print("★ 勝利！敵を撃破！")
	elif my_hp <= 0:
		emit_signal("game_over", "enemy")
		print("★ 敗北...")

# ===== 指標計算 =====
func calculate_metrics() -> Dictionary:
	var my_tiles = 0
	var enemy_tiles = 0
	var total_tiles = 81

	# 盤面スキャン
	for row in board.tiles:
		for tile in row:
			var state = tile.get_meta("state")
			if state == board.TileState.MY:
				my_tiles += 1
			elif state == board.TileState.ENEMY:
				enemy_tiles += 1

	# 支配率
	var area = float(my_tiles) / total_tiles

	# 連結率（簡易版：最大グループサイズ）
	var max_connected = calculate_max_cluster(board.TileState.MY)
	var cluster = float(max_connected) / my_tiles if my_tiles > 0 else 0.0

	# 敵の連結率
	var enemy_max_connected = calculate_max_cluster(board.TileState.ENEMY)
	var enemy_cluster = float(enemy_max_connected) / enemy_tiles if enemy_tiles > 0 else 0.0

	# 拠点支配（簡易版：まだ未実装なので0）
	var control = 0.0

	return {
		"area": area,
		"cluster": cluster,
		"control": control,
		"enemy_cluster": enemy_cluster,
		"my_tiles": my_tiles,
		"enemy_tiles": enemy_tiles
	}

# ===== 最大連結グループ計算 =====
func calculate_max_cluster(target_state) -> int:
	var visited = {}
	var max_size = 0

	for y in range(9):
		for x in range(9):
			var coord = Vector2i(x, y)
			if coord in visited:
				continue

			var tile = board.tiles[y][x]
			if tile.get_meta("state") == target_state:
				var cluster_size = flood_fill_cluster(coord, target_state, visited)
				max_size = max(max_size, cluster_size)

	return max_size

func flood_fill_cluster(start: Vector2i, target_state, visited: Dictionary) -> int:
	var stack = [start]
	var size = 0

	while stack.size() > 0:
		var coord = stack.pop_back()

		if coord in visited:
			continue

		# 範囲チェック
		if coord.x < 0 or coord.x >= 9 or coord.y < 0 or coord.y >= 9:
			continue

		# 状態チェック
		var tile = board.tiles[coord.y][coord.x]
		if tile.get_meta("state") != target_state:
			continue

		visited[coord] = true
		size += 1

		# 隣接4マスを追加
		stack.append(coord + Vector2i(1, 0))
		stack.append(coord + Vector2i(-1, 0))
		stack.append(coord + Vector2i(0, 1))
		stack.append(coord + Vector2i(0, -1))

	return size

# ===== 封印発動 =====
func activate_seal():
	print("\n★★★ 封印発動！ ★★★")
	enemy_hp -= 220
	seal_gauge = 50  # リセット
	print("追加ダメージ 220！ 敵HP: %.1f" % enemy_hp)

# ===== ゲーム終了 =====
func end_game():
	print("\n===== 60秒経過！ゲーム終了 =====")

	if my_hp > enemy_hp:
		emit_signal("game_over", "player")
		print("★ 勝利！HP差: %.1f" % (my_hp - enemy_hp))
	else:
		emit_signal("game_over", "enemy")
		print("★ 敗北... HP差: %.1f" % (enemy_hp - my_hp))

	# ゲーム停止
	get_tree().paused = true
