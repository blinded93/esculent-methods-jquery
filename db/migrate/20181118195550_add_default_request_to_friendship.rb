class AddDefaultRequestToFriendship < ActiveRecord::Migration[5.2]
  def change
    change_column :friendships, :request, :boolean, default: false
  end
end
