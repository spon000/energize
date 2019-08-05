history_filename_path = ''
history_filename_prefix = 'history'
history_filename_extension = '.txt'

def get_filename(gid):
  return history_filename_prefix + str(gid) + history_filename_extension

def init_history_table(game):
  filename = get_filename(game.id)
  file = open(filename,'w+')
  file.close()
  return True

# def open_history_table(game):
#   filename = get_filename(game)
#   if not file:
#     file = open(filename, 'a')

# def append_history_table():
#   filename = get_filename(game)
#   if file: 
#     file.write(history_record);
#   file.close()

# def close_history_table(file):
#   file.close()







