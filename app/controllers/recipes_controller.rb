class RecipesController < ApplicationController
  before_action :create_favorited_recipe_service, only: [:favorited, :favorite]
  before_action :error_if_not_logged_in, only: [:create, :update, :favorited, :favorite, :share]

  def index
    pagy, recipes = pagy(Recipe.by_favorites, {items: 5})

    render json: recipes,
           meta: pagy,
           status: 200
  end

  def create
    recipe = current_user.recipes.create(recipe_params)

    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include: ['ingredient_amounts.ingredient'],
           status: 200
  end

  def show
    recipe = Recipe.find_by(id:params[:id])

    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include: ['ingredient_amounts.ingredient'],
           status: 200
  end

  def update
    recipe = Recipe.find_by(id:params[:id])

    recipe.update(recipe_params)
    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include: ['ingredient_amounts.ingredient'],
           status: 200
  end

  def favorited
    @favorite.current_user = current_user
    @favorite.favorited?
    render json: @favorite,
           status: 200
  end

  def favorite
    @favorite.current_user = current_user
    @favorite.toggle_favorite
    render json: @favorite,
           status: 200
  end

  def share
    friend = User.find_by(id: params[:friend_id])
    ShareService.create_and_send(share_params)
    render json: {friend: friend},
           status: 200
  end

  def search
    meta, recipes = pagy(Recipe.search(params[:query]), {items: 8, query:params[:query]})

    render json: recipes,
           meta: meta,
           status: 200
  end

  def ingredient_search
    ingredients = Ingredient.from_names(params[:query])
    ingredient_ids = ingredients.collect(&:id)
    meta, recipes = pagy(Recipe.with_ingredients(ingredient_ids), {items: 8, query:params[:query]})

    render json: recipes,
           meta: meta,
           status: 200
  end

  private
    def create_favorited_recipe_service
      @favorite = FavoritedRecipeService.new(recipe_id:params[:recipe_id])
    end

    def share_params
      params[:user_id] = current_user.id
      params.permit(:user_id, :friend_id, :recipe_id)
    end

    def recipe_params
      params.require(:recipe).permit(:name, :cook_time, :prep_time, :servings, :skill_level, :image, :directions => [], ingredient_attributes:[:id, :quantity, :unit, :name, :state])
    end
end
