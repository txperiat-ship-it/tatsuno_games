extends CanvasLayer

# ===== ラベル参照 =====
var label_my_hp
var label_enemy_hp
var label_timer

# ===== 参照 =====
var battle_system

func _ready():
	print("UI起動開始...")

	# VBoxContainerを確認
	if has_node("VBoxContainer"):
		print("✓ VBoxContainer見つかりました")

		# ラベル取得
		if has_node("VBoxContainer/MyHP"):
			label_my_hp = get_node("VBoxContainer/MyHP")
			print("✓ MyHPラベル見つかりました")
		else:
			print("❌ エラー：MyHPラベルが見つかりません")

		if has_node("VBoxContainer/EnemyHP"):
			label_enemy_hp = get_node("VBoxContainer/EnemyHP")
			print("✓ EnemyHPラベル見つかりました")
		else:
			print("❌ エラー：EnemyHPラベルが見つかりません")

		if has_node("VBoxContainer/Timer"):
			label_timer = get_node("VBoxContainer/Timer")
			print("✓ Timerラベル見つかりました")
		else:
			print("❌ エラー：Timerラベルが見つかりません")
	else:
		print("❌ エラー：VBoxContainerが見つかりません")
		print("UIの子ノード一覧:")
		for child in get_children():
			print("  - ", child.name)

	# ラベルが全て見つかった場合のみ初期化
	if label_my_hp and label_enemy_hp and label_timer:
		# 初期テキスト設定
		label_my_hp.text = "自分HP: 2000 / 2000"
		label_enemy_hp.text = "敵HP: 2000 / 2000"
		label_timer.text = "時間: 60秒"

		# フォント設定（強制的に表示）
		for label in [label_my_hp, label_enemy_hp, label_timer]:
			label.add_theme_font_size_override("font_size", 48)
			label.add_theme_color_override("font_color", Color.WHITE)
			label.add_theme_color_override("font_outline_color", Color.BLACK)
			label.add_theme_constant_override("outline_size", 4)

		# VBoxContainerの位置を強制設定
		var vbox = get_node("VBoxContainer")
		vbox.position = Vector2(50, 50)
		vbox.size = Vector2(600, 300)

		print("✓ ラベル初期化完了")

	# 戦闘システムと接続
	var parent = get_parent()
	if parent and parent.has_node("BattleSystem"):
		battle_system = parent.get_node("BattleSystem")
		battle_system.connect("hp_changed", Callable(self, "_on_hp_changed"))
		print("✓ BattleSystemと接続完了")
		print("UI起動！")
	else:
		print("❌ 警告：BattleSystemが見つかりません")
		if parent:
			print("親の子ノード一覧:")
			for child in parent.get_children():
				print("  - ", child.name)

func _process(delta):
	if not battle_system or not label_timer:
		return

	# タイマー更新
	var remaining = 60 - battle_system.game_timer
	label_timer.text = "時間: %d秒" % max(0, int(remaining))

	# 点滅（ラスト10秒）
	if remaining <= 10:
		label_timer.modulate = Color.RED if int(remaining * 2) % 2 == 0 else Color.WHITE

func _on_hp_changed(my_hp, enemy_hp):
	if not label_my_hp or not label_enemy_hp:
		return

	label_my_hp.text = "自分HP: %.0f / 2000" % my_hp
	label_enemy_hp.text = "敵HP: %.0f / 2000" % enemy_hp

	# 色変化
	label_my_hp.modulate = Color.GREEN if my_hp > 1000 else (Color.YELLOW if my_hp > 500 else Color.RED)
	label_enemy_hp.modulate = Color.GREEN if enemy_hp > 1000 else (Color.YELLOW if enemy_hp > 500 else Color.RED)
