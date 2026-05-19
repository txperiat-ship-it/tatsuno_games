extends Node

# ===== 参照 =====
var board

# ===== AI変数 =====
var ai_ink = 100.0
var ai_timer = 0.0
var ai_action_interval = 2.0  # 2秒ごとに行動

# ===== 敵の現在位置 =====
var current_pos = Vector2i(7, 1)  # 右上からスタート

func _ready():
	print("敵AI起動開始...")

	# 親ノードを確認
	var parent = get_parent()
	print("親ノード: ", parent.name if parent else "なし")

	# Boardノードを探す
	if parent and parent.has_node("Board"):
		board = parent.get_node("Board")
		print("✓ Boardノード見つかりました！")
		print("敵AI起動！")
	else:
		print("❌ エラー：Boardノードが見つかりません")
		print("親の子ノード一覧:")
		if parent:
			for child in parent.get_children():
				print("  - ", child.name)

func _process(delta):
	if not board:
		return  # Boardが見つからない場合は何もしない

	# AIタイマー
	ai_timer += delta
	if ai_timer >= ai_action_interval:
		ai_action()
		ai_timer = 0.0

	# インク回復（簡易）
	ai_ink = min(100, ai_ink + 3 * delta)

# ===== AI行動 =====
func ai_action():
	if not board:
		return

	if ai_ink < 10:
		print("敵：インク不足")
		return

	# 戦略：ランダムウォーク（隣接マスを塗る）
	var directions = [
		Vector2i(1, 0),   # 右
		Vector2i(-1, 0),  # 左
		Vector2i(0, 1),   # 下
		Vector2i(0, -1)   # 上
	]

	# ランダムな方向を選ぶ
	var dir = directions[randi() % 4]
	var next_pos = current_pos + dir

	# 盤面内かチェック
	if next_pos.x < 0 or next_pos.x >= 9 or next_pos.y < 0 or next_pos.y >= 9:
		return

	# 塗る
	board.set_tile_state(next_pos.x, next_pos.y, board.TileState.ENEMY)
	current_pos = next_pos
	ai_ink -= 2

	print("敵が塗った: ", next_pos, " 残りインク: ", ai_ink)
