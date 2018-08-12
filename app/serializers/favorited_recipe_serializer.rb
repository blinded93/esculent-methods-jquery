class FavoritedRecipeSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :recipe_id, :favorite, :errors, :favoriteStatus
end
