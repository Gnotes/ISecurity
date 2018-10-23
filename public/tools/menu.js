/**
 * 顶部菜单模板
 * 
 * 菜单：https://electronjs.org/docs/api/menu
 * 菜单项：https://electronjs.org/docs/api/menu-item
 */

const template = [
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'toggledevtools' },
    ]
  },
  {
    role: 'Window',
    submenu: [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'front' }
    ]
  },
  {
    role: 'Help',
    submenu: [
      {
        label: 'About Author',
        click() { require('electron').shell.openExternal('https://github.com/Xing-He') }
      },
      {
        label: 'Learn More',
        click() { require('electron').shell.openExternal('https://github.com/Gnotes/ISecurity') }
      }
    ]
  }
]

module.exports = template;