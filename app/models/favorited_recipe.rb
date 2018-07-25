class FavoritedRecipe < ApplicationRecord
  belongs_to :user
  belongs_to :recipe

  scope :for, -> (user_id) { where(user_id:user_id) }
end
