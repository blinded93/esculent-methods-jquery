class Share < ApplicationRecord
  belongs_to :user,
    class_name: 'User',
    foreign_key: 'user_id'
  belongs_to :friend,
    class_name: 'User',
    foreign_key: 'friend_id'
  belongs_to :recipe

  scope :by_recipe, -> (id) { where(recipe_id:id) }
  scope :by_user, -> (id) { where(user_id:id) }
end
