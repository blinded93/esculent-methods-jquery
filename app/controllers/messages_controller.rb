class MessagesController < ApplicationController
  def create
    message = current_user.sent_messages.build(message_params)
    message.save
    render json: message,
           status: 200
  end

  def destroy
    user = User.find(params[:user_id])
    if params[:message_ids]
      # delete stuff goes here
      render json: {message_ids: params[:message_ids]}, status: 200
    elsif params[:id]
      message = Message.find_by(id:params[:id])
      # delete stuff here
      render json: message, status: 200
    end
  end

  private
    def message_params
      params.require(:message).permit(:recipient_id, :subject, :body, :user_id, :recipe_id)
    end
end
