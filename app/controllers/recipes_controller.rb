class RecipesController < ApplicationController
  def index
    if params[:user_id]
      recipes = Recipe.for(params[:user_id])
    else
      recipes = Recipe.by_favorites
    end

    render json: recipes, status: 200
  end

  def show
    recipe = Recipe.find_by_id(params[:id])
    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include:['ingredient_amounts.ingredient'],
           status: 200
  end

  def favorited
    favorite = FavoritedRecipe.find_by(recipe_id:params[:recipe_id],
                                       user:current_user)
    render json: {favorite: favorite.try(:id)},
           status:200
  end

  def favorite
    favorite = FavoritedRecipe.find_by(params[:favorite_id])
    if !!favorite
      favorite.destroy
    else
      favorite = FavoritedRecipe.create({recipe_id:params[:recipe_id],                                       user:current_user})
    end
    render json: {favorite: favorite.try(:id)},
           status:200
  end
end
