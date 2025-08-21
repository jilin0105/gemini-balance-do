import { jsx } from 'hono/jsx';

export const Render = ({ isAuthenticated, showWarning }: { isAuthenticated: boolean; showWarning: boolean }) => {
	if (!isAuthenticated) {
		return (
			<html>
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>登录</title>
					<script src="https://cdn.tailwindcss.com"></script>
					<style>
						{`
							body::-webkit-scrollbar {
								display: none;
							}
							body {
								-ms-overflow-style: none;
								scrollbar-width: none;
							}
						`}
					</style>
				</head>
				<body class="bg-gray-100 flex items-center justify-center h-screen p-4">
					<div class="w-full max-w-sm">
						<form id="login-form" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
							<div class="mb-4">
								<label class="block text-gray-700 text-sm font-bold mb-2" for="auth-key">
									ACCESS_KEY
								</label>
								<input
									class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="auth-key"
									type="password"
									placeholder="******************"
								/>
							</div>
							<div class="flex items-center justify-between">
								<button
									class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
									type="submit"
								>
									登录
								</button>
							</div>
						</form>
					</div>
					<script>
						{`
							document.getElementById('login-form').addEventListener('submit', async function(e) {
								e.preventDefault();
								const key = document.getElementById('auth-key').value;
								const response = await fetch(window.location.href, {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ key }),
								});
								if (response.ok) {
									window.location.reload();
								} else {
									alert('登录失败');
								}
							});
						`}
					</script>
				</body>
			</html>
		);
	}

	return (
		<html>
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Gemini API 密钥管理</title>
				<script src="https://cdn.tailwindcss.com"></script>
				<style>
					{`
						body::-webkit-scrollbar {
							display: none;
						}
						body {
							-ms-overflow-style: none;
							scrollbar-width: none;
						}
						.sidebar-hidden {
							transform: translateX(-100%);
						}
						.sidebar-visible {
							transform: translateX(0);
						}
						.overlay {
							background-color: rgba(0, 0, 0, 0.5);
						}
					`}
				</style>
			</head>
			<body class="bg-gray-100 font-sans antialiased">
				{showWarning && (
					<div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4" role="alert">
						<strong class="font-bold">安全警告：</strong>
						<span class="block">
							当前 HOME_ACCESS_KEY 或 AUTH_KEY 为默认值，请尽快修改环境变量并重新部署 Worker！
						</span>
					</div>
				)}
				<div class="flex flex-col md:flex-row min-h-screen">
					<button
						id="hamburger-btn"
						class="md:hidden p-4 bg-gray-800 text-white focus:outline-none fixed top-0 left-0 w-16 z-30"
					>
						☰
					</button>

					<div
						id="sidebar"
						class="w-64 bg-gray-800 text-white p-4 fixed md:relative left-0 top-0 h-full z-20 transition-transform duration-300 ease-in-out sidebar-hidden md:translate-x-0"
					>
						<h1 class="text-2xl font-bold mb-8 text-center">管理面板</h1>
						<nav>
							<a href="#" class="block py-2 px-4 rounded hover:bg-gray-700">
								密钥管理
							</a>
						</nav>
					</div>

					<div
						id="overlay"
						class="fixed inset-0 z-10 bg-black opacity-0 invisible transition-opacity duration-300 ease-in-out md:hidden"
					></div>

					<div class="flex-1 p-6 md:p-8 overflow-y-auto mt-16 md:mt-0">
						<h2 class="text-2xl md:text-3xl font-bold mb-6">Gemini API 密钥管理</h2>
						<div class="grid grid-cols-1 gap-6 md:gap-8">
							<div class="bg-white p-6 rounded-lg shadow-md">
								<h3 class="text-xl font-semibold mb-4">批量添加密钥</h3>
								<form id="add-keys-form">
									<textarea
										id="api-keys"
										class="w-full h-40 p-2 border rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
										placeholder="请输入API密钥，每行一个"
									></textarea>
									<button type="submit" class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200">
										添加密钥
									</button>
								</form>
							</div>
							<div class="bg-white p-6 rounded-lg shadow-md">
								<div class="flex flex-col sm:flex-row justify-between items-center mb-4">
									<h3 class="text-xl font-semibold mb-2 sm:mb-0">已存储的密钥</h3>
									<div class="flex space-x-2">
										<button id="check-keys-btn" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
											一键检查
										</button>
										<button id="refresh-keys-btn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-200">
											刷新
										</button>
									</div>
								</div>
								<div class="max-h-60 overflow-y-auto border rounded">
									<table id="keys-table" class="w-full text-left">
										<thead>
											<tr class="border-b">
												<th class="p-2 w-6">
													<input type="checkbox" id="select-all-keys" class="form-checkbox h-4 w-4 text-blue-600" />
												</th>
												<th class="p-2 font-mono">API 密钥</th>
												<th class="p-2">状态</th>
											</tr>
										</thead>
										<tbody>
											{/* 动态加载密钥 */}
										</tbody>
									</table>
								</div>
								<button
									id="delete-selected-keys-btn"
									class="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 hidden"
								>
									删除选中
								</button>
							</div>
						</div>
					</div>
				</div>

				<script>
					{`
						document.addEventListener('DOMContentLoaded', () => {
							const sidebar = document.getElementById('sidebar');
							const hamburgerBtn = document.getElementById('hamburger-btn');
							const overlay = document.getElementById('overlay');

							const addKeysForm = document.getElementById('add-keys-form');
							const apiKeysTextarea = document.getElementById('api-keys');
							const refreshKeysBtn = document.getElementById('refresh-keys-btn');
							const keysTableBody = document.querySelector('#keys-table tbody');
							const selectAllCheckbox = document.getElementById('select-all-keys');
							const deleteSelectedBtn = document.getElementById('delete-selected-keys-btn');
							const checkKeysBtn = document.getElementById('check-keys-btn');

							const toggleSidebar = () => {
								const isHidden = sidebar.classList.contains('sidebar-hidden');
								if (isHidden) {
									sidebar.classList.remove('sidebar-hidden');
									sidebar.classList.add('sidebar-visible');
									overlay.classList.remove('invisible', 'opacity-0');
									overlay.classList.add('visible', 'opacity-100');
									document.body.style.overflow = 'hidden';
								} else {
									sidebar.classList.remove('sidebar-visible');
									sidebar.classList.add('sidebar-hidden');
									overlay.classList.remove('visible', 'opacity-100');
									overlay.classList.add('invisible', 'opacity-0');
									document.body.style.overflow = '';
								}
							};

							if (hamburgerBtn && sidebar && overlay) {
								hamburgerBtn.addEventListener('click', toggleSidebar);
								overlay.addEventListener('click', toggleSidebar);
							}

							const updateSidebarOnResize = () => {
								if (window.innerWidth >= 768) {
									if (!sidebar.classList.contains('sidebar-hidden')) {
										sidebar.classList.add('sidebar-hidden');
										sidebar.classList.remove('sidebar-visible');
									}
									if (overlay.classList.contains('visible')) {
										overlay.classList.add('invisible', 'opacity-0');
										overlay.classList.remove('visible', 'opacity-100');
									}
									document.body.style.overflow = '';
								}
							};

							window.addEventListener('resize', updateSidebarOnResize);
							updateSidebarOnResize();

							const fetchAndRenderKeys = async () => {
								keysTableBody.innerHTML = '<tr><td colspan="3" class="p-2 text-center">加载中...</td></tr>';
								try {
								  const response = await fetch('/api/keys');
								  if (!response.ok) throw new Error('Failed to fetch keys');
								  const { keys } = await response.json();
								  keysTableBody.innerHTML = '';
								  if (keys && keys.length === 0) {
								    keysTableBody.innerHTML = '<tr><td colspan="3" class="p-2 text-center">暂无密钥</td></tr>';
								  } else if (keys) {
								    keys.forEach(key => {
								      const row = document.createElement('tr');
								      row.dataset.key = key;
								      // 修复了 class 和 data-key 的拼接语法
								      row.innerHTML = `
								        <td class="p-2 w-6"><input type="checkbox" class="key-checkbox form-checkbox h-4 w-4 text-blue-600" data-key="${key}" /></td>
								        <td class="p-2 font-mono">${key}</td>
								        <td class="p-2 status-cell">未知</td>
								      `;
								      keysTableBody.appendChild(row);
								    });
								  }
								} catch (error) {
								  keysTableBody.innerHTML = '<tr><td colspan="3" class="p-2 text-center text-red-500">加载失败</td></tr>';
								  console.error('Failed to fetch keys:', error);
								}
							};

							const updateDeleteButtonVisibility = () => {
								const selectedKeys = document.querySelectorAll('.key-checkbox:checked');
								deleteSelectedBtn.classList.toggle('hidden', selectedKeys.length === 0);
							};

							selectAllCheckbox.addEventListener('change', () => {
								const checkboxes = document.querySelectorAll('.key-checkbox');
								checkboxes.forEach(checkbox => {
									checkbox.checked = selectAllCheckbox.checked;
								});
								updateDeleteButtonVisibility();
							});

							keysTableBody.addEventListener('change', (e) => {
								if (e.target.classList.contains('key-checkbox')) {
									updateDeleteButtonVisibility();
									if (!e.target.checked && selectAllCheckbox.checked) {
										selectAllCheckbox.checked = false;
									}
								}
							});

							deleteSelectedBtn.addEventListener('click', async () => {
								const selectedKeys = Array.from(document.querySelectorAll('.key-checkbox:checked')).map(cb => cb.dataset.key);
								if (selectedKeys.length === 0) {
									alert('请至少选择一个密钥。');
									return;
								}

								if (!confirm(`确定要删除选中的 ${selectedKeys.length} 个密钥吗？`)) {
									return;
								}

								try {
									const response = await fetch('/api/keys', {
										method: 'DELETE',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({ keys: selectedKeys }),
									});
									const result = await response.json();
									if (response.ok) {
										alert(result.message || '密钥删除成功。');
										fetchAndRenderKeys();
										updateDeleteButtonVisibility();
										selectAllCheckbox.checked = false;
									} else {
										alert(`删除密钥失败: ${result.error || '未知错误'}`);
									}
								} catch (error) {
									alert('请求失败，请检查网络连接。');
									console.error('Failed to delete keys:', error);
								}
							});

							checkKeysBtn.addEventListener('click', async () => {
								const rows = keysTableBody.querySelectorAll('tr');
								rows.forEach(row => {
									const statusCell = row.querySelector('.status-cell');
									if (statusCell) {
										statusCell.textContent = '检查中...';
										statusCell.className = 'p-2 status-cell text-gray-500';
									}
								});

								try {
									const response = await fetch('/api/keys/check');
									if (!response.ok) throw new Error('Failed to check keys');
									const results = await response.json();
									results.forEach(result => {
										const row = keysTableBody.querySelector(`tr[data-key="${result.key}"]`);
										if (row) {
											const statusCell = row.querySelector('.status-cell');
											if (statusCell) {
												statusCell.textContent = result.valid ? '有效' : '无效';
												statusCell.className = result.valid ? 'p-2 status-cell text-green-500' : 'p-2 status-cell text-red-500';
											}
										}
									});
								} catch (error) {
									alert('检查密钥失败，请查看控制台获取更多信息。');
									console.error('Failed to check keys:', error);
								}
							});

							addKeysForm.addEventListener('submit', async (e) => {
								e.preventDefault();
								const keys = apiKeysTextarea.value.split('\n').map(k => k.trim()).filter(k => k !== '');
								if (keys.length === 0) {
									alert('请输入至少一个API密钥。');
									return;
								}
								try {
									const response = await fetch('/api/keys', {
										method: 'POST',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({ keys }),
									});
									const result = await response.json();
									if (response.ok) {
										alert(result.message || '密钥添加成功。');
										apiKeysTextarea.value = '';
										fetchAndRenderKeys();
									} else {
										alert(`添加密钥失败: ${result.error || '未知错误'}`);
									}
								} catch (error) {
									alert('请求失败，请检查网络连接。');
									console.error('Failed to add keys:', error);
								}
							});

							refreshKeysBtn.addEventListener('click', fetchAndRenderKeys);

							fetchAndRenderKeys();
						});
					`}
				</script>
			</body>
		</html>
	);
};
