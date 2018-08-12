class FavoritedRecipeService
  attr_accessor :recipe_id, :current_user, :favorite, :errors, :favoriteStatus

  def initialize(params)
    @recipe_id = params[:recipe_id]
    @current_user = params[:current_user]
    @errors = {}
  end

  def favorited?
    self.favorite = FavoritedRecipe.find_by(recipe_id: recipe_id, user: current_user)
  end

  def toggle_favorite
    if favorited?
      self.favoriteStatus = false
      favorite.destroy
    else
      self.favoriteStatus = true
      FavoritedRecipe.create(recipe_id: recipe_id, user:current_user)
    end
  end
end
